import { useState, useMemo } from 'react';
import { Product } from '../types';

export function useFilters(allProductsForFilters: Product[]) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRangeMax, setPriceRangeMax] = useState<number>(1500);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best-match');

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRangeMax(1500);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    setSearchQuery('');
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allProductsForFilters.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [allProductsForFilters]);

  const uniqueColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    allProductsForFilters.forEach(p => {
      p.colors?.forEach(c => {
        if (c.name && c.hex) {
          colorMap.set(c.name, c.hex);
        }
      });
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [allProductsForFilters]);

  return {
    selectedCategories,
    setSelectedCategories,
    priceRangeMax,
    setPriceRangeMax,
    selectedSizes,
    setSelectedSizes,
    selectedColors,
    setSelectedColors,
    minRating,
    setMinRating,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    handleCategoryToggle,
    handleSizeToggle,
    handleColorToggle,
    handleClearAllFilters,
    uniqueCategories,
    uniqueColors,
  };
}
