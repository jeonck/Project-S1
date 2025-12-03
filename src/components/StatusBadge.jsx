const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case '완료':
        return 'status-completed';
      case '진행중':
        return 'status-progress';
      case '계획':
      case '예정':
        return 'status-planned';
      default:
        return 'status-planned'; // Default to 'planned' if status is not found
    }
  };

  return <span className={getStatusClass(status)}>{status}</span>;
};

export default StatusBadge;
