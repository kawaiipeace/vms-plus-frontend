import React from "react";

interface RatingProps {
  title: string;
  description: string;
  icon: string;
}

const Rating = ({ title, description, icon }: RatingProps) => {
  return (
    <>
      <div className="col-span-12">
        <div className="flex gap-x-2">
          <div>
            <i className="material-symbols-outlined text-[#A80689] !text-3xl">{icon}</i>
          </div>
          <div className="text-left">
            <div>
              <p className="font-bold text-lg">{title}</p>
              <p>{description}</p>
            </div>
            <div className="mt-3">
              <div className="rating rating-lg gap-x-4">
                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="1 star" />
                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="2 star" />
                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="3 star" />
                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="4 star" />
                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="5 star" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rating;
