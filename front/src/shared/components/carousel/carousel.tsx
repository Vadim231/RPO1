import { PropsWithChildren, ReactElement } from 'react';
interface modalProps {
  carouselItems: string[];
}
export default function Carousel({
  carouselItems,
}: PropsWithChildren<modalProps>): ReactElement {
  return (
    <div
      id="infinite-loop"
      data-carousel='{ "loadingClasses": "opacity-0", "isInfiniteLoop": true }'
      className="relative w-full"
    >
      <div className="carousel h-80">
        <div className="carousel-body h-full opacity-0">
          {carouselItems.map((url, index) => {
            return (
              <div key={`carosousel_${index}`} className="carousel-slide">
                <div className="bg-base-200/60 flex h-full justify-center p-6">
                  <img src={url} alt="image" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <!-- Previous Slide --> */}
      {carouselItems.length == 1 ? (
        ''
      ) : (
        <>
          <button
            type="button"
            className="carousel-prev start-5 max-sm:start-3 carousel-disabled:opacity-50 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm"
          >
            <span className="icon-[tabler--chevron-left] size-5 cursor-pointer"></span>
            <span className="sr-only">Previous</span>
          </button>
          {/* <!-- Next Slide --> */}
          <button
            type="button"
            className="carousel-next end-5 max-sm:end-3 carousel-disabled:opacity-50 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm"
          >
            <span className="icon-[tabler--chevron-right] size-5"></span>
            <span className="sr-only">Next</span>
          </button>
        </>
      )}
    </div>
  );
}
