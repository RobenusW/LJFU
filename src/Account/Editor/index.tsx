import React, { useState } from "react";

export default function ResumeEditor() {
  const [links, setLinks] = useState([""]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employment, setEmployment] = useState([]);

  // Handlers
  function handleAdd<T>(
    state: T[], // Current state, an array of type T
    setState: React.Dispatch<React.SetStateAction<T[]>>, // State setter function
    newItem: T // New item to be added to the state
  ): void {
    setState([...state, newItem]);
  }

  function handleRemove<T>(
    state: T[], // Current state, an array of type T
    setState: React.Dispatch<React.SetStateAction<T[]>>, // State setter function
    index: number // Index of the item to be removed
  ): void {
    const updated = state.filter((_, i) => i !== index);
    setState(updated);
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Resume Editor</h1>

      {/* Basic Information */}
      <div className="card p-3 mb-4">
        <h3>Basic Information</h3>
        <div className="row">
          <div className="col-md-6">
            <label>Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-6">
            <label>Phone Number</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-6">
            <label>Location</label>
            <input type="text" className="form-control" />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input type="email" className="form-control" />
          </div>
        </div>
        {/* Links */}
        <div className="mt-3">
          <label>Links (Max 3)</label>
          {links.map((link, index) => (
            <div key={index} className="d-flex align-items-center my-2">
              <input
                type="text"
                className="form-control"
                value={link}
                onChange={(e) => {
                  const updatedLinks = [...links];
                  updatedLinks[index] = e.target.value;
                  setLinks(updatedLinks);
                }}
              />
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleRemove(links, setLinks, index)}
                disabled={links.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          {links.length < 3 && (
            <button
              className="btn btn-primary mt-2"
              onClick={() => handleAdd(links, setLinks, "")}
            >
              Add Link
            </button>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="card p-3 mb-4">
        <h3>Education</h3>
        {education.map((entry, index) => (
          <div key={index} className="mb-3">
            <label>College</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="College Name"
              value={entry.college}
              onChange={(e) => {
                const updated = [...education];
                updated[index].college = e.target.value;
                setEducation(updated);
              }}
            />
            <button
              className="btn btn-danger"
              onClick={() => handleRemove(education, setEducation, index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={() =>
            handleAdd(education, setEducation, { college: "", major: "" })
          }
        >
          Add Education
        </button>
      </div>

      {/* Skills */}
      <div className="card p-3 mb-4">
        <h3>Skills</h3>
        {skills.map((skill, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              value={skill}
              onChange={(e) => {
                const updatedSkills = [...skills];
                updatedSkills[index] = e.target.value;
                setSkills(updatedSkills);
              }}
            />
            <button
              className="btn btn-danger ms-2"
              onClick={() => handleRemove(skills, setSkills, index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={() => handleAdd(skills, setSkills, "")}
        >
          Add Skill
        </button>
      </div>

      {/* Projects */}
      <div className="card p-3 mb-4">
        <h3>Projects</h3>
        {projects.map((project, index) => (
          <div key={index} className="mb-3">
            <label>Project Name</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Project Name"
              value={project.name}
              onChange={(e) => {
                const updated = [...projects];
                updated[index].name = e.target.value;
                setProjects(updated);
              }}
            />
            <label>Links (Max 3)</label>
            <input type="text" className="form-control mb-2" />
            <button
              className="btn btn-danger"
              onClick={() => handleRemove(projects, setProjects, index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={() =>
            handleAdd(projects, setProjects, { name: "", links: [""] })
          }
        >
          Add Project
        </button>
      </div>

      {/* Past Employment */}
      <div className="card p-3 mb-4">
        <h3>Past Employment</h3>
        {employment.map((job, index) => (
          <div key={index} className="mb-3">
            <label>Job Name</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Job Name"
              value={job.name}
              onChange={(e) => {
                const updated = [...employment];
                updated[index].name = e.target.value;
                setEmployment(updated);
              }}
            />
            <button
              className="btn btn-danger"
              onClick={() => handleRemove(employment, setEmployment, index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={() =>
            handleAdd(employment, setEmployment, { name: "", dates: "" })
          }
        >
          Add Employment
        </button>
      </div>
    </div>
  );
}
