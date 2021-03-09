class schHelper {

    filterRides(rides, date) {
        let data;
        if (date === '' || date === undefined) {
            data = [];
        }

        else {
            data = rides.filter(ride => {
                return (ride.date === date);
            });
        }
        return data;
    }


    countRides(rides) {
        let total = 0;
        total = rides.reduce((accum, curr) => {
            return accum + 1;
        }, 0);
        console.log('this is the total I\'m returning', total, 'with rides', rides);
        return total;
    }


    getLink(trainName) {
        switch (trainName) {
            case '1': return 'https://new.mta.info/document/9426';
            case '2': return 'https://new.mta.info/document/9431';
            case '3': return 'https://new.mta.info/document/9436';
            case '4': return 'https://new.mta.info/document/9441';
            case '5': return 'https://new.mta.info/document/9446';
            case '6': return 'https://new.mta.info/document/9456';
            case '7': return 'https://new.mta.info/document/9461';
            case 'A': return 'https://new.mta.info/document/9466';
            case 'C': return 'https://new.mta.info/document/9471';
            case 'E': return 'https://new.mta.info/document/9476';
            case 'B': return 'https://new.mta.info/document/9481';
            case 'D': return 'https://new.mta.info/document/9486';
            case 'F': return 'https://new.mta.info/document/10366';
            case 'M': return 'https://new.mta.info/document/9496';
            case 'G': return 'https://new.mta.info/document/9501';
            case 'J Z': return 'https://new.mta.info/document/9506';
            case 'N': return 'https://new.mta.info/document/9511';
            case 'Q': return 'https://new.mta.info/document/9516';
            case 'R': return 'https://new.mta.info/document/9521';
            case 'W': return 'https://new.mta.info/document/9526';
            case 'L': return 'https://new.mta.info/document/18241';


        }
    }

    // deleteRide(rides, rideToDel) {
    //     let newRides = [];
    //     rides.forEach(ride => {
    //         if (ride.date !== rideToDel.date && ride.time !== rideToDel.time && ride.location !== rideToDel.location) {
    //             newRides.push(ride);
    //         }
    //     });

    //     return newRides;
    // }
}

module.exports = schHelper;