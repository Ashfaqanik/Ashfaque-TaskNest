import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import {
  Home,
  ShieldAlert,
  Search,
  Settings,
  User,
  Layers3,
  Users,
  ChevronUp,
  ChevronDown,
  X,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
}

const projects: Project[] = [
  { id: "1", name: "Project One" },
  { id: "2", name: "Project Two" },
  { id: "3", name: "Project Three" },
];

export default function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showPriority, setShowPriority] = useState(true);

  return (
    <div
      className={`${styles.sidebar} ${
        isSidebarCollapsed ? styles.collapsed : styles.expanded
      }`}
    >
      <div className={styles.container}>
        <div className={styles.topLogoSection}>
          <img className={styles.image} alt="TaskNest" />
          {isSidebarCollapsed ? null : (
            <button
              className={styles.closeButton}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <X className={styles.icon} />
            </button>
          )}
        </div>
        {/* Divider */}
        <hr className={styles.divider} />
        {/* NAVBAR LINKS */}
        <nav className={styles.nav}>
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* PROJECTS LINKS */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className={styles.toggleButton}
        >
          <span>Projects</span>
          {showProjects ? <ChevronUp /> : <ChevronDown />}
        </button>

        {showProjects &&
          projects.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}
        {/* PRIORITY LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className={styles.toggleButton}
        >
          <span>Priority</span>
          {showPriority ? <ChevronUp /> : <ChevronDown />}
        </button>

        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon: Icon,
  label,
  href,
}) => (
  <Link to={href} className={styles.sidebarLink}>
    <Icon className={styles.icon} />
    <span>{label}</span>
  </Link>
);
