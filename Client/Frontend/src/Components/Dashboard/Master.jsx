import React from 'react';

const ProductRow = ({ item }) => (
  <tr className="border-b border-[var(--border-md)] hover:bg-[var(--color-neutral-white-200)]">
    <td className="py-[var(--spacing-50)] px-[var(--spacing-50)] text-[var(--spacing-300)]" style={{ fontFamily: 'var(--font-inter)', whiteSpace: 'nowrap' }}>{item.sno}</td>
    <td className="py-[var(--spacing-50)] px-[var(--spacing-50)] text-[var(--spacing-300)]" style={{ fontFamily: 'var(--font-inter)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{item.itemName}</td>
    <td className="py-[var(--spacing-50)] px-[var(--spacing-50)] text-[var(--spacing-300)]" style={{ fontFamily: 'var(--font-inter)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{item.itemCode}</td>
  </tr>
);

const ProductMaster = () => {
  const products = [
    { sno: 1, itemName: 'HP DeskJet Wireless Color', itemCode: '93731' },
    { sno: 2, itemName: 'Apple Pencil (2nd Generation) White', itemCode: '78577' },
    { sno: 3, itemName: 'Apple Lightning to USB Cable', itemCode: '30321' },
    { sno: 4, itemName: 'HP DeskJet Wireless Color', itemCode: '44322' },
    { sno: 5, itemName: 'Fjällräven Women\'s Kanken Backpack', itemCode: '32116' },
    { sno: 6, itemName: 'YETI Rambler Jr. 12 oz Kids Bottle', itemCode: '68545' },
    { sno: 7, itemName: 'TV 24" Professional LED Monitor HDMI', itemCode: '40322' },
    { sno: 8, itemName: 'Dakine Accessory Case', itemCode: '69822' },
    { sno: 9, itemName: 'Mead Spiral Notebooks 6 Pack', itemCode: '48144' },
    { sno: 10, itemName: 'Travel Laptop Backpack', itemCode: '45453' },
  ];

  return (
    <div className="container mx-auto p-[var(--spacing-50)]" style={{ fontFamily: 'var(--font-inter)', maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="mb-[var(--spacing-50)]">
        <h1 className="text-[var(--spacing-500)] font-bold" style={{ color: 'var(--color-neutral-black-600)' }}>Product Master</h1>
      </div>
      <table className="w-full border-collapse" style={{ tableLayout: 'fixed', maxWidth: '100%', overflowX: 'hidden' }}>
        <thead>
          <tr className="bg-[var(--color-neutral-white-300)]">
            <th className="py-[var(--spacing-50)] px-[var(--spacing-50)] text-[var(--spacing-300)]" style={{ fontFamily: 'var(--font-inter)', color: 'var(--color-neutral-black-600)', whiteSpace: 'nowrap' }}>S.N</th>
            <th className="py-[var(--spacing-50)] px-[var(--spacing-50)] text-[var(--spacing-300)]" style={{ fontFamily: 'var(--font-inter)', color: 'var(--color-neutral-black-600)', whiteSpace: 'nowrap' }}>Item Name</th>
            <th className="py-[var(--spacing-50)] px-[var(--spacing-50)] text-[var(--spacing-300)]" style={{ fontFamily: 'var(--font-inter)', color: 'var(--color-neutral-black-600)', whiteSpace: 'nowrap' }}>Item Code</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <ProductRow key={item.itemCode} item={item} />
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-[var(--spacing-50)]">
        <span className="text-[var(--color-neutral-black-400)] text-[var(--spacing-300)]">1 of 9</span>
      </div>
    </div>
  );
};

export default ProductMaster;