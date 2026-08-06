The question was simple: “When do you use Promise.any, Promise.all, Promise.race, and Promise.allSettled?”
But the answer wasn’t about syntax. It was about real-world decisions.

𝗣𝗿𝗼𝗺𝗶𝘀𝗲.𝗮𝗻𝘆() → Need ONE success
• Backup APIs
• Multiple CDNs
• Login providers
• Server fallback
• Retry logic

𝗣𝗿𝗼𝗺𝗶𝘀𝗲.𝗮𝗹𝗹() → Need EVERYTHING
• Dashboard data
• Checkout flow
• Required APIs
• File uploads
• Microservices data

𝗣𝗿𝗼𝗺𝗶𝘀𝗲.𝗿𝗮𝗰𝗲() → Need FASTEST
• API timeout
• Fastest server
• Cancel slow calls
• Live search
• Real-time events

𝗣𝗿𝗼𝗺𝗶𝘀𝗲.𝗮𝗹𝗹𝗦𝗲𝘁𝘁𝗹𝗲𝗱() → Need ALL results
• File upload status
• Logging/analytics
• Bulk operations
• Multiple APIs
• Retry failures

![alt text](image-1.png)
