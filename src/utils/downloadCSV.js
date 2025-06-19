// utils/downloadCsv.js
export const downloadBase64Csv = (base64Data, fileName) => {
	const decodedData = atob(base64Data);
	const blob = new Blob([decodedData], { type: 'text/csv;charset=utf-8;' });

	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.setAttribute('href', url);
	link.setAttribute('download', fileName);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
