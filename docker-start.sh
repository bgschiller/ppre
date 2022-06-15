#!/bin/bash
set -euo pipefail

# unwrap JSON_ALL_SECRETS into individual variables
for name in $(jq -r 'keys | .[]' <(echo $JSON_ALL_SECRETS)); do
  export $name="$(jq -r ".$name" <(echo $JSON_ALL_SECRETS))"
done

if [[ -z "${PGDATABASE:-}" ]]; then
  echo "No database set up, skipping migrations"
else
  # Set up the database environment variable that prisma expects and run migrations
  echo "(SKIPPED) running prisma migrate deploy"
  export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}"
  npx prisma migrate status | tee migrate-status

  # Only apply migrations if there are outstanding migrations yet to be applied.
  # This allows the containers to come back up after a rollback caused by a failing migration
  if grep 'not yet been applied' migrate-status; then
    npx prisma migrate deploy
  fi
fi

# Start the remix server
# The `exec` is to that it replaces this process as PID 1 and handles SIGTERMs and whatnot correctly
echo "Starting server"
exec npm start
