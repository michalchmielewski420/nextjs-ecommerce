'use client';

interface SortDropdownProps {
  currentSort: string;
  selectedCategory?: string;
  searchQuery?: string;
}

export default function SortDropdown({ currentSort, selectedCategory, searchQuery }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) => {
          const targetSort = e.target.value;
          const catParam = selectedCategory ? `&category=${selectedCategory}` : '';
          const searchParam = searchQuery ? `&search=${searchQuery}` : '';
          window.location.href = `/?sort=${targetSort}${catParam}${searchParam}`;
        }}
        value={currentSort}
        className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors text-gray-900"
      >
        <option value="newest">Najnowsze 📅</option>
        <option value="price_asc">Cena: od najniższej 📉</option>
        <option value="price_desc">Cena: od najwyższej 📈</option>
        <option value="popular">Najpopularniejsze ❤️</option>
      </select>
    </div>
  );
}