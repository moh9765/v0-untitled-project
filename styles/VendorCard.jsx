import React from 'react';

const VendorCard = ({ id, name, image, rating }) => {
  return (
    <div className="vendor-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Rating: {rating}/5</p>
    </div>
  );
};

// تحسين الأداء باستخدام React.memo
export default React.memo(VendorCard, (prevProps, nextProps) => {
  // إعادة التصيير فقط إذا تغيرت البيانات الأساسية
  return prevProps.id === nextProps.id && 
         prevProps.rating === nextProps.rating;
});