import React from "react";
import Navbar from "../../NavBar";
import { resources } from "./Collections/resources";

interface Resource {
  title: string;
  link: string;
  description: string;
}

const Resources: React.FC = () => {
  const courses = resources.filter((resource) =>
    [
      "Roadmap.sh",
      "The Odin Project",
      "Free Code Camp",
      "Harvard CS50",
      "CodePath",
      "MIT OpenCourseWare",
      "edX",
      "Fullstack Open",
      "College Compendium",
      "Teach Yourself Computer Science",
      "Invent with Python",
      "Fireship",
      "Web.dev Learn",
      "Eloquent JavaScript",
      "Google Developers C++",
    ].includes(resource.title)
  );

  const libraries = resources.filter(
    (resource) =>
      ![
        "Roadmap.sh",
        "Free Code Camp",
        "The Odin Project",
        "Harvard CS50",
        "CodePath",
        "MIT OpenCourseWare",
        "edX",
        "Fullstack Open",
        "College Compendium",
        "Teach Yourself Computer Science",
        "Invent with Python",
        "Fireship",
        "Web.dev Learn",
        "Eloquent JavaScript",
        "Google Developers C++",
      ].includes(resource.title)
  );

  const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-100"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
        {resource.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {resource.description}
      </p>
    </a>
  );

  const ResourceSection: React.FC<{ title: string; resources: Resource[] }> = ({
    title,
    resources,
  }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ marginTop: "80px" }}>
          <Navbar />
        </div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Learning Resources
          </h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Curated collection of no-cost high-quality learning materials to
            help you advance your programming skills and build an awesome
            resume.
          </p>
          <ResourceSection title="Courses" resources={courses} />
          <ResourceSection
            title="Libraries & Other Resources"
            resources={libraries}
          />
        </div>
      </div>
    </>
  );
};

export default Resources;
