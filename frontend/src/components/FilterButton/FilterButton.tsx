import { ReactNode, useEffect, useState } from "react";
import styles from "./FilterButton.module.scss";
import { X } from "lucide-react";

type FilterButtonProps = {
  className?: string;
  children: ReactNode;
  onFilterChange: (filter: string) => void;
};

const FilterButton = ({
  className,
  children,
  onFilterChange,
}: FilterButtonProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
    if (isFilterOpen) {
      setSelectedFilter(null);
      onFilterChange("");
    }
  };

  const handleFilterClick = (filter: string) => {
    const newFilter = selectedFilter === filter ? null : filter;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter || ""); // Passing the new filter to the parent
  };
  useEffect(() => {
    onFilterChange(selectedFilter || "");
  }, [selectedFilter]);

  return (
    <div>
      {/* Filter Button */}
      <button
        className={`${styles.iconButton} ${className}`}
        onClick={toggleFilter}
      >
        {children}
      </button>

      {isFilterOpen && (
        <div className={`${styles.filterMenu} filterMenuColor`}>
          <div className={styles.header}>
            <h4>Priority</h4>
            <button onClick={toggleFilter} className={styles.closeButton}>
              <X className={`${styles.icon} icon`} />
            </button>
          </div>
          <ul>
            <li>
              <input
                type="radio"
                id="urgent"
                name="filter" // Ensures only one radio button is selected
                checked={selectedFilter === "Urgent"}
                onChange={() => handleFilterClick("Urgent")}
              />
              <label htmlFor="urgent">Urgent</label>
            </li>
            <li>
              <input
                type="radio"
                id="high"
                name="filter"
                checked={selectedFilter === "High"}
                onChange={() => handleFilterClick("High")}
              />
              <label htmlFor="high">High</label>
            </li>
            <li>
              <input
                type="radio"
                id="medium"
                name="filter"
                checked={selectedFilter === "Medium"}
                onChange={() => handleFilterClick("Medium")}
              />
              <label htmlFor="medium">Medium</label>
            </li>
            <li>
              <input
                type="radio"
                id="low"
                name="filter"
                checked={selectedFilter === "Low"}
                onChange={() => handleFilterClick("Low")}
              />
              <label htmlFor="low">Low</label>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
