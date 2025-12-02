import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const TeamMembers = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    department: '',
    role: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const openModal = (member = null) => {
    setCurrentMember(member);
    if (member) {
      setFormValues({ name: member.name, department: member.department, role: member.role });
    } else {
      setFormValues({ name: '', department: '', role: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
    setFormValues({ name: '', department: '', role: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMember) {
      updateTeamMember(currentMember.id, formValues);
    } else {
      addTeamMember(formValues);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 팀원을 삭제하시겠습니까?')) {
      deleteTeamMember(id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="main-title mb-4 md:mb-0">팀원 관리</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          + 팀원 추가
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200 text-gray-800 text-left text-sm uppercase font-semibold tracking-wider">
              <th className="px-5 py-3">이름</th>
              <th className="px-5 py-3">소속</th>
              <th className="px-5 py-3">직급</th>
              <th className="px-5 py-3 text-center">액션</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-5 py-5 text-sm text-gray-800">{member.name}</td>
                <td className="px-5 py-5 text-sm text-gray-800">{member.department}</td>
                <td className="px-5 py-5 text-sm text-gray-800">{member.role}</td>
                <td className="px-5 py-5 text-sm text-center">
                  <button
                    onClick={() => openModal(member)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teamMembers.length === 0 && (
          <p className="text-center text-gray-500 py-8">등록된 팀원이 없습니다.</p>
        )}
      </div>

      {/* Modal for Add/Edit Team Member */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {currentMember ? '팀원 수정' : '팀원 추가'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">
                  소속
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formValues.department}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                  직급
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formValues.role}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  {currentMember ? '저장' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
