Input:
const arr = [
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 2, 2, 2, 2, 0, 0, 0],
[0, 0, 0, 2, 2, 0, 0, 0],
[0, 0, 0, 2, 2, 2, 2, 0],
[0, 0, 0, 0, 0, 2, 0, 0],
[0, 0, 0, 0, 0, 2, 2, 0],
]

//Replace all all the similar pixels at arr[3][3] with 3. 
//Which is basically replace all 2 with 3.
Output:
[
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 3, 3, 3, 3, 0, 0, 0],
[0, 0, 0, 3, 3, 0, 0, 0],
[0, 0, 0, 3, 3, 3, 3, 0],
[0, 0, 0, 0, 0, 3, 0, 0],
[0, 0, 0, 0, 0, 3, 3, 0],
]

Flood fill also called as seed fill is an algorithm to determine the area connected to the given node in a multi-dimensional array.

The most common use of this is to use it as a bucket to fill connected, same colored areas in the painting apps Or in the images to replace the pixels with same color.



const floodFill = (image, sr, sc, newColor) => {
    //Get the input which needs to be replaced.
    const current = image[sr][sc];
    
    //If the newColor is same as the existing 
    //Then return the original image.
    if(current === newColor){
        return image;
    }
    
    //Other wise call the fill function which will fill in the existing image.
    fill(image, sr, sc, newColor, current);
    
    //Return the image once it is filled
    return image;
};

const fill = (image, sr, sc, newColor, current) => {
    //If row is less than 0
    if(sr < 0){
        return;
    }

    //If column is less than 0
    if(sc < 0){
        return;
    }

    //If row is greater than image length
    if(sr > image.length - 1){
        return;
    }

    //If column is greater than image length
    if(sc > image[sr].length - 1){
        return;
    }

    //If the current pixel is not which needs to be replaced
    if(image[sr][sc] !== current){
        return;
    }
    
     //Update the new color
     image[sr][sc] = newColor;
    
    
     //Fill in all four directions
     //Fill Prev row
     fill(image, sr - 1, sc, newColor, current);

     //Fill Next row
     fill(image, sr + 1, sc, newColor, current);

     //Fill Prev col
     fill(image, sr, sc - 1, newColor, current);

     //Fill next col
     fill(image, sr, sc + 1, newColor, current);
    
}



Input:
console.log(floodFill([[1,1,1],[1,1,0],[1,0,1]], 0, 1, 2));

Output:
[[2,2,2],[2,2,0],[2,0,1]]