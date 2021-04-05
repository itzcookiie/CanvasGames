# CanvasGames

### Game developer journey

Starting my journey as a game developer by building games with canvas.

Current games so far:
- Falling Block - Move left and right to dodge falling blocks

Time taken to make: About 5 - 6 hours

### Notes

Didn't totally finish. Wanted to add an option to move the letters up and down and later at random speeds in random directions. Was basically going to do an observer/event listener approach where I register the indexes into an array. Then I check if the array exists and create a global variable that tells me if we started the interval for moving the letters independently. I would also make an extra argument on the mainDraw function for moving letters so if it is passed in, it will just clear the part of the canvas I specifically tell it to and that's it - it won't run the whole loop. If the moving letter interval function has started, I will change the global variable e.g. movingLettersInterval to true and mainDraw will no longer will try to move the letters itself - it will leave it entirely to the moving interval function.

Wanted to implement this, but don't want to spend any more time on this. Happy to know I knew what I was going to do - observers FTW!!!!
