**Intuitive Incrementality**

**What if everything you thought you knew about marketing attribution was only half the story?** Most attribution models tell you *who* touched the customer, but not *what truly moved the needle*. In a world drowning in clicks, views, and vanity metrics, the real question marketers must answer is: *Did this campaign actually drive lift, or would it have happened anyway?* That’s where **incrementality** comes in — not just as a buzzword, but as a fundamental shift in how we measure what matters.

| It’s essential for marketers to think Incrementality when they think Measurements.  |
| :---- |

To understand incrementality better, let us start with this most popular case study.

**​​The $50 Million Question: What Happens When You Turn Off Google Ads?**

At eBay, the marketing team had long believed their $50 million annual spend on Google ads was a critical engine of growth. After all, the data looked convincing — people who clicked on their ads often made purchases. The correlation seemed too strong to ignore. But Steve Tadelis, an economist on eBay’s research team, wasn’t so sure. What if that high correlation was masking a deeper truth? Were these ads really driving purchases, or were they just capturing intent that already existed?

To find out, Tadelis teamed up with fellow economists Tom Blake and Chris Nosko to run a bold experiment. They systematically turned Google search ads on and off in different markets, monitoring both paid and organic traffic. What they discovered was startling.

Yes, paid traffic dropped when the ads were turned off — but organic traffic surged. Customers who had been clicking on branded search ads simply shifted to clicking on unpaid links. The implication was clear: many of these users were already on their way to making a purchase. The ads hadn’t created new demand — they’d merely intercepted it.

In essence, eBay had been spending tens of millions to "buy" customers who would have come anyway.

This wasn’t just a marketing optimization insight. It was a wake-up call about the dangers of relying on correlation-heavy attribution models. And it underscored a fundamental principle: **only through measuring incrementality can we truly understand what marketing efforts are worth.**

| Marketing Measurements should be thought of as a causal reasoning process to infer incrementality.  |
| :---- |

This is where models like Marketing Mix Modeling (MMM) and techniques like controlled experiments offer a distinct advantage over traditional attribution. While attribution focuses on allocating credit to touchpoints — whether through rules or algorithms — it lacks the ability to estimate a true baseline or measure the *incremental* impact of marketing activities.

| Touch-based attribution is fundamentally blind to both causality and incrementality — the very pillars of effective marketing measurement. Relying on it risks misguiding decisions and misallocating budgets. Its role in modern marketing needs a serious rethink. |
| :---- |

**Let’s look at a few illustrative scenarios.**

**Scenario 1 \-** Imagine you own a physical store and have placed an out-of-home billboard just around the corner to promote a new product line. Most of the people walking into your store are likely to have seen that billboard. But the real question is: *Would they have walked in even without seeing it?* And if so, *would they still have made a purchase?*

**Scenario 2 \-** Consider another example : every customer who enters your store receives a coupon offering a 10% discount on their purchase. At that point, the customer is already in the store and likely ready to buy. So, does that extra 10% discount actually drive incremental value — by converting more walk-ins into transactions — or are you simply giving away margin?

In both of the above scenarios, mapping user journeys to conversion may reveal a strong correlation — between billboard exposure and store footfall, and between coupon redemption and sales. However, attribution alone provides no mechanism to distinguish whether these correlations reflect genuine causal impact or are merely spurious.

### 

### **So, how do we actually measure *incrementality* in these scenarios?**

There are two primary approaches to answering this question:

1. **Causal Modeling (using historical data)**  
   This approach involves analyzing past data to make quasi-causal inferences. For example, we compare time periods when billboard ads were active near your store to periods when they weren’t — or times when in-store discount coupons were issued versus when they weren’t. By controlling for known confounders and mediators, and incorporating assumptions around adstock effects and saturation, we can estimate the incremental impact of these initiatives with reasonable confidence.   
   If you operate multiple stores and have varied your marketing tactics across them — such as placing billboards near some but not others, or selectively issuing coupons — this cross-sectional variation provides additional observations, which strengthens the reliability of the causal estimates.  
2. **Controlled Experiments (using randomized or geo-based tests)**

   This method involves actively designing an experiment. You define a test group — either a randomly selected group of individuals or a set of similar geographic markets — and expose them to the marketing intervention (e.g., billboard ads or discount coupons). You then compare their behavior to a control group that did not receive the intervention. This setup allows for a more direct and robust measurement of causal impact.

### **The Hard Parts of Incrementality – Interaction Effects**

What we’ve discussed so far — measuring the standalone impact of individual marketing initiatives — is, in many ways, the *easier* part of incrementality. But marketing doesn’t operate in a vacuum. It unfolds in the real world, where multiple campaigns, channels, and touchpoints interact in complex, often unpredictable ways. This is where things get trickier — and where *interaction effects* come into play.

| In complexity science , the phenomenon where a system exhibits properties not present in its individual parts, resulting in a whole greater than the sum of its parts, is called emergence. |
| :---- |

In real-world marketing systems, the whole is rarely equal to the sum of its parts. In fact, it’s often either *greater* or *lesser*. 

#### **1\. Synergy**

Synergy occurs when the combined effect of two or more marketing efforts exceeds the sum of their individual impacts. For example, a customer exposed to both a TV ad and a follow-up email may be significantly more likely to convert than if they had seen just one of the two. The interactions reinforce each other, creating a multiplier effect.

#### **2\. Cannibalism**

On the other hand, cannibalism arises when one campaign reduces the effectiveness of another. A common example: running a branded search ad that captures users who were already going to convert through organic channels. Instead of adding value, the paid touchpoint simply displaces the organic one — inflating costs without generating true incremental lift.

### **Why It’s Hard (and How to Measure It)**

Accounting for interaction effects requires moving beyond linear or siloed thinking. Marketers need to recognize and model the *joint* influence of initiatives — not just their individual contributions. This can be done in two key ways:

* **In modeling**: Incorporate *interaction terms* in your regression or media mix models, or use *nested models* to account for layered campaign structures (e.g., TOF driving BOF engagement). These methods help you estimate whether and how combinations of channels drive different outcomes compared to their isolated effects.  
* **In experiments**: Design tests that measure *combined* treatments. For example, one group might receive both a display ad and a discount offer, while other groups receive only one of the two. This helps isolate the true lift generated by the interaction.

Most importantly, marketers must bring *domain knowledge* and *strategic hypotheses* into this process. Not all channels are likely to interact in meaningful ways — but many do, and failing to account for those interactions can lead to flawed conclusions and inefficient spending.

The eBay case study we discussed? That was from 2012 — over a decade ago. So, none of this is new wisdom. These are time-tested techniques that have been quietly powering the decision-making engines of the world’s most successful companies. Major retail brands have relied on incrementality-based measurement for decades, and the biggest tech giants have built sophisticated in-house experimentation platforms capable of running controlled tests and quasi-causal studies at global scale.

At Lifesight, our mission is to democratize these capabilities — to make it simple and accessible for brands of all sizes to adopt proven, high-impact methods for measuring what truly matters. Incrementality isn’t just a buzzword; it’s the foundation of smarter marketing.

And that’s the case for incrementality — not as a trend, but as a necessity.

