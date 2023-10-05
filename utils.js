export default class Utils
{

    isInsideBoard(row, col) {
        return (row >= 0) && (col >= 0) && (row < 4) && (col < 4);
    }
    
    tilePosition(pos) {
        return 272 + pos * 85;
    }

    getRandomNumber(spec) {
        let index, sum = 0;
        let randomNumber = Math.random();
        for (index in spec) {
          sum += spec[index];
          if (randomNumber <= sum) return index;
        }
    }
}