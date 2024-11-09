import { useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import '../ClassManagement.css';
import { Link } from 'react-router-dom';

type Student = {
  id: number;
  name: string;
  interests: string[];
};

const ClassManagement = () => {
  const [students] = useState<Student[]>([
    {
      id: 1,
      name: "Alice Johnson",
      interests: ["Mathematics", "Debate Club", "Piano"]
    },
    {
      id: 2,
      name: "Bob Smith",
      interests: ["Science", "Soccer", "Photography"]
    },
    {
      id: 3,
      name: "Carol Williams",
      interests: ["Literature", "Art", "Chess Club"]
    }
  ]);

  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  const toggleStudent = (studentId: number) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  return (
    <>
      <Link to={"/home"}>
        <h2 className="backButton">
          <i className="bi bi-arrow-left-square-fill"></i>
        </h2>
      </Link>
      <div className="class-management">
        <div className="management-card">
          <div className="management-header">
            <Users size={20} color="white" />
            <h1>Class Management</h1>
          </div>

          <div className="students-container">
            <div className="students-list">
              {students.map((student) => (
                <div key={student.id} className="student-card">
                  <button
                    onClick={() => toggleStudent(student.id)}
                    className="student-button"
                  >
                    <span>{student.name}</span>
                    {expandedStudent === student.id ? (
                      <ChevronUp size={20} color="white" />
                    ) : (
                      <ChevronDown size={20} color="white" />
                    )}
                  </button>

                  {expandedStudent === student.id && (
                    <div className="interests-section">
                      <div className="interests-header">
                        Interests:
                      </div>
                      <div className="interests-list">
                        {student.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="interest-tag"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassManagement;