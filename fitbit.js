const date = require("date-and-time");
module.exports = {
    async retrieveDates(userData){
        var data = Array.from(userData);
        var dateIndex = data[0].indexOf("ActivityDate");
        let dateArray = [];
        for(let i = 1; i < 7; i++){
            const dateFormat = date.format(new Date(data[i][dateIndex]), "DD-MM-YYYY");            
            dateArray.push(dateFormat);
        } 
        return dateArray;
    },
    async retrieveEntries(userData, entry){
        var data = Array.from(userData);
        var entryIndex = data[0].indexOf(entry);
        let entryArray = [];
        for(let i = 1; i < 7; i++){
            entryArray.push(Math.round(data[i][entryIndex] * 100) / 100);
        } 
        return entryArray;
    }
    
}
