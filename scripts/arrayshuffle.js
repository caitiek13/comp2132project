export {arrayShuffle};

function arrayShuffle(anArray){
        let j, x, i;

        for (i = anArray.length - 1; i > 0; i--) {

            j = Math.floor(Math.random() * (i + 1));
            x = anArray[i];

            anArray[i] = anArray[j];
            anArray[j] = x;
        }

        return anArray;
}