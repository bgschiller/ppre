import type { SpecificLocale, Asset } from "~/@types/generated/contentful";
import { getImageProps, getSrcSet } from "./index";

export interface ContentfulAssetProps {
  asset: SpecificLocale<Asset>;
  wrapperClassName?: string;
  assetClassName?: string;
}

export function ContentfulAsset({
  asset,
  wrapperClassName,
  assetClassName,
}: ContentfulAssetProps) {
  const isImage = asset.fields.file.contentType.startsWith("image");
  const isVideo = asset.fields.file.contentType.startsWith("video");
  return (
    <>
      {isImage && (
        <div className={wrapperClassName}>
          <picture>
            <source
              className={assetClassName}
              type="image/avif"
              srcSet={getSrcSet({
                // We know this is an image, so it's safe to assume image is set
                width: asset.fields.file.details.image!.width,
                url: asset.fields.file.url,
                increment: 500,
                avif: true,
              })}
            />
            {
              // This is safe to ignore because we know alt text is coming from getImageProps()
              // eslint-disable-next-line jsx-a11y/alt-text
              <img className={assetClassName} {...getImageProps(asset)} />
            }
          </picture>
        </div>
      )}
      {isVideo && (
        <div className={wrapperClassName}>
          <video
            className={assetClassName}
            src={asset.fields.file.url}
            controls
          />
        </div>
      )}
    </>
  );
}
