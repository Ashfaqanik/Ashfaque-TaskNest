import Header from "../../components/Header/Header";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import TaskCard from "../../components/TaskCard/TaskCard";
import UserCard from "../../components/UserCard/UserCard";
import { useSearchResultsQuery } from "../../state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import styles from "./SearchPage.module.scss";
import { useSidebar } from "../../context/SidebarContext";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isSidebarCollapsed } = useSidebar();

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchResultsQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch]);

  const displayResults =
    searchTerm.length >= 3 && !isLoading && !isError && searchResults;

  return (
    <div className={styles.container}>
      <Header name="Search" />
      <div className={styles.searchInputContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          className={`${styles.searchInput} searchInputColor`}
          onChange={handleSearch}
        />
      </div>
      <div className={styles.resultsContainer}>
        {isLoading && <p className={styles.loadingText}>Loading...</p>}
        {isError && (
          <p className={styles.errorText}>
            Error occurred while fetching search results.
          </p>
        )}
        {!isLoading && !isError && searchResults && displayResults && (
          <div className={styles.results}>
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2 className={`${styles.sectionTitle} searchResultsTitle`}>
                Tasks
              </h2>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects?.length > 0 && (
              <h2 className={styles.sectionTitle}>Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users?.length > 0 && (
              <h2 className={styles.sectionTitle}>Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
        {!displayResults && searchTerm.length < 3 && (
          <p
            className={`${styles.emptyText} ${
              !isSidebarCollapsed ? styles.expanded : styles.collapsed
            }`}
          >
            Start typing to search...
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
