import { useCallback, useState } from 'react';

const SearchComponent = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // استخدم useCallback لمنع إعادة الإنشاء
  const handleSearch = useCallback((searchQuery) => {
    // تأخير محاكاة للبحث غير المتزامن
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [onSearch]); // أضف التبعيات هنا

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
};