/**
 * Finds and clicks elements in sequence with a specified delay.
 * This is useful for testing UI behavior under rapid user input on a local development server.
 *
 * How it works:
 * 1. An `async` function is used to allow for the `await` keyword, which pauses execution.
 * 2. It gets all parent elements with the class "frx-list-item".
 * 3. It iterates through each parent element.
 * 4. Inside each parent, it searches for the child element with the class "scroll-to-frx".
 * 5. If the child element is found, it's clicked.
 * 6. The function then pauses for 25 milliseconds before proceeding to the next element.
 */
async function testClickSequence() {
  console.log("Starting click sequence test...");
  
  // 1. Find all the parent container elements.
  const parentElements = document.getElementsByClassName("frx-list-item");
  
  if (parentElements.length === 0) {
    console.warn("No elements found with the class 'frx-list-item'.");
    return;
  }

  // 2. Loop through each parent element.
  for (const item of parentElements) {
    
    // 3. Find the specific clickable element inside the current parent.
    const clickableElement = item.querySelector(".scroll-to-frx");
    
    // 4. If the clickable element exists, simulate a click.
    if (clickableElement) {
      console.log("Clicking ->", clickableElement);
      clickableElement.click();
      
      // 5. Wait for 25ms before the next loop iteration.
      await new Promise(resolve => setTimeout(resolve, 250));
    } else {
      console.log("No '.scroll-to-frx' found in:", item);
    }
  }
  
  console.log("✅ Click sequence test finished.");
}

// Run the function
testClickSequence();
