export const useFiles = () => {
    const saveJSONFile = (object, filename) => {
        const json = JSON.stringify(object, null, 2); // Преобразуем объект в строку JSON
        const blob = new Blob([json], {type: "application/json"}); // Создаем Blob из строки JSON
        const url = URL.createObjectURL(blob); // Создаем URL для Blob

        const a = document.createElement("a"); // Создаем элемент <a>
        a.href = url;
        a.download = filename + ".json"; // Устанавливаем имя файла
        a.click();// "Жмем" на <a>, чтобы начать скачивание

        URL.revokeObjectURL(url); // Очищаем URL после скачивания
    };

    //функция возвращает Promise
    const loadJSON = (file) => {
        let reader = new FileReader();
        const result = new Promise((resolve, reject) => {
            reader.onload = () => {
                try {
                    let content = JSON.parse(reader.result);
                    this.file = {content: content, name: file.name};
                    resolve({content: content, name: file.name});

                } catch (e) {
                    console.log('onload error:', e);
                    reject(e);
                }
            };
        });
        reader.readAsText(file);
        return result;
    };
    return {
        saveJSONFile,
        loadJSON,
        };
};
