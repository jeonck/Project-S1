const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case '설계':
        return 'status-progress';
      case '종료':
        return 'status-completed';
      case '진단':
        return 'status-diagnosis';
      case '요구정의':
        return ''; // '요구정의' 상태는 표시하지 않음
      default:
        return ''; // 알 수 없는 상태도 표시하지 않음
    }
  };

  if (status === '요구정의') {
    return null; // '요구정의' 상태일 때는 아무것도 렌더링하지 않음
  }

  return <span className={getStatusClass(status)}>{status}</span>;
};

export default StatusBadge;
