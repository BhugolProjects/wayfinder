import React from "react";

function CategoryItem({ name, image }) {
  return (
    <div className="flex flex-col flex-1">
      <img loading="lazy" src={image} alt={`${name} category`} className="object-contain rounded-none aspect-square w-[70px]" />
      <div className="self-center mt-1.5">{name}</div>
    </div>
  );
}

export default CategoryItem;