const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    const statusClasses = {
      '예정': 'status-planned',
      '계획': 'status-planned',
      '진행중': 'status-progress',
      '진행 중': 'status-progress',
      '보류': 'status-delayed',
      '완료': 'status-completed',
    };
    return statusClasses[status] || 'status-planned'; // Default to 'planned' if status is not found
  };

  return <span className={getStatusClass(status)}>{status}</span>;
};

export default StatusBadge;
