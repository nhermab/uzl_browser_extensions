async function humanTypewriter(text) {
    console.log("%c⏳ CLICK YOUR DOC NOW! Analyzing text structure... starting in 5 seconds.", "color: blue; font-size: 16px; font-weight: bold;");
    await new Promise(r => setTimeout(r, 5000));

    // Find the magic Google Docs iframe
    const iframe = document.querySelector(".docs-texteventtarget-iframe") || document.querySelector(".docs-textevent-target-iframe");
    if (!iframe) return console.error("❌ Error: Could not find Google Docs iframe.");
    
    const input = iframe.contentDocument.activeElement;
    console.log("✅ Simulation started. Typing...");

    // -------------------------------------------------------------
    // 3. THE "HUMAN" ALGORITHM
    // -------------------------------------------------------------
    
    // Helper to generate a delay based on context
    const simulateDelay = async (char) => {
        let ms = 0;

        // BASE TYPING SPEED (Varies per keypress: 80ms - 150ms)
        // This simulates physical finger travel time
        ms = Math.random() * 70 + 80;

        // CONTEXT 1: Word Boundaries (Space)
        // We pause slightly to think of the next word (add 100-300ms)
        if (char === ' ') {
            ms += Math.random() * 200 + 100;
        }

        // CONTEXT 2: Sentence Boundaries (., ?, !)
        // We pause to close the mental thought (add 400-900ms)
        if (['.', '?', '!', ',', ';'].includes(char)) {
            ms += Math.random() * 500 + 400;
        }

        // CONTEXT 3: Random "Brain Farts" / Stumbles
        // 2% chance to just stop for 1-2 seconds (simulating checking screen or distraction)
        if (Math.random() < 0.02) {
            console.log("🤔 Thinking/Stumble...");
            ms += Math.random() * 1000 + 1000; 
        }

        return new Promise(r => setTimeout(r, ms));
    };

    // -------------------------------------------------------------
    // 4. EXECUTION LOOP
    // -------------------------------------------------------------
    for (const char of text) {
        
        // --- A. NEW PARAGRAPH (The "Deep Think") ---
        if (char === '\n') {
            // Trigger Enter Key
            const enterEv = document.createEvent("Event");
            enterEv.initEvent("keydown", true, true);
            enterEv.keyCode = 13;
            input.dispatchEvent(enterEv);
            
            const pressEv = document.createEvent("Event");
            pressEv.initEvent("keypress", true, true);
            pressEv.keyCode = 13;
            input.dispatchEvent(pressEv);

            // Calculate "Thinking Time" (Between 8 and 15 seconds)
            const thinkTime = Math.random() * 7000 + 8000;
            console.log(`💤 Paragraph break. Thinking for ${(thinkTime/1000).toFixed(1)}s...`);
            await new Promise(r => setTimeout(r, thinkTime));
        } 
        
        // --- B. STANDARD TYPING ---
        else {
            const charCode = char.charCodeAt(0);
            const eventObj = document.createEvent("Event");
            eventObj.initEvent("keypress", true, true);
            eventObj.keyCode = charCode;
            eventObj.which = charCode;
            eventObj.charCode = charCode;
            input.dispatchEvent(eventObj);

            // Apply the human delay logic
            await simulateDelay(char);
        }
    }

    console.log("✅ Writing complete.");
}

humanTypewriter(`_PUT_TEXT_HERE`);
