export const shortenKey = (address) => {
  if (address === 'MINING_REWARD') {
    return 'Mining reward';
  } else if (address.length > 10) {
    const firstPart = address.slice(0, 5);
    const lastPart = address.slice(-5);
    const shortenedAddress = firstPart + '...' + lastPart;
    return shortenedAddress;
  } else {
    return address;
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert('Public key copied to clipboard');
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('sv-SE');
};

export const getToken = () => {
  const storedLoginInfo = localStorage.getItem('loginInfo');

  return storedLoginInfo;
};
