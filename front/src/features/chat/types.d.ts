export interface AttachedFileProps {
  fileName: string;
  fileMessage: string;
  fileSize: string;
  fileType: string;
  fileInfo: string;
}
export interface AttachedImageProps {
  imageMessage: string | undefined | null | '';
  imageURL: string;
}
export interface AttachedGalleryProps {
  galleryMessage: string | undefined | null | '';
  galleryURLs: string[];
}
