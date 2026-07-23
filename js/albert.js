document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Animated Widget Markup with Baby Doll Icon
    const widgetHTML = `
        <div id="albert-widget">
            <button id="albert-toggle" class="albert-pop-roll" aria-label="Chat with Albert">
                <span class="albert-icon">👶</span>
                <span class="albert-label">Chat with Albert</span>
            </button>
            <div id="albert-chatbox" class="albert-hidden">
                <div class="albert-header">
                    <div class="albert-avatar">👶</div>
                    <div>
                        <strong>Albert</strong>
                        <p>AXON Assistant</p>
                    </div>
                    <button id="albert-close">&times;</button>
                </div>
                <div id="albert-messages">
                    <div class="albert-msg bot">Hi! 👋 I'm Albert. How can I help you with AXON courses or services today?</div>
                </div>
                <form id="albert-form">
                    <input type="text" id="albert-input" placeholder="Type your question..." required autocomplete="off" />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    `;


    
    document.body.insertAdjacentHTML("beforeend", widgetHTML);

    // 2. Query Elements
    const toggleBtn = document.getElementById("albert-toggle");
    const closeBtn = document.getElementById("albert-close");
    const chatbox = document.getElementById("albert-chatbox");
    const form = document.getElementById("albert-form");
    const input = document.getElementById("albert-input");
    const messagesContainer = document.getElementById("albert-messages");

    // 3. Toggle Visibility
    toggleBtn.addEventListener("click", () => chatbox.classList.toggle("albert-hidden"));
    closeBtn.addEventListener("click", () => chatbox.classList.add("albert-hidden"));

    // 4. Send Message Handler
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userText = input.value.trim();
        if (!userText) return;

        // Display User Message
        appendMessage(userText, "user");
        input.value = "";

        // Display Loading Bubble
        const loadingDiv = appendMessage("Albert is typing...", "bot loading");

        try {
            const res = await fetch("/api/albert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText })
            });
            const data = await res.json();
            
            loadingDiv.remove();
            appendMessage(data.reply || "Sorry, I couldn't understand that.", "bot");
        } catch (err) {
            loadingDiv.remove();
            appendMessage("Something went wrong. Please try again.", "bot");
        }
    });

    function appendMessage(text, type) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `albert-msg ${type}`;
        msgDiv.innerText = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return msgDiv;
    }
});