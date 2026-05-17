const fs = require('fs');

const rawText = `1. actually / now

Please can we go home now?

It looks quite small, but actually it's over 5 metres high.

2. advice / advise

My grandfather gave me a very useful piece of advice.

I advise you to put all your money into a deposit account.

3. affect / effect

The cuts in spending will have a serious effect on the hospital.

The strike will seriously affect the train service.

4. already / yet

I haven't seen her yet this morning.

I've already done my shopping.

5. afraid of / worried about

I am afraid of snakes.

She's worried about the baby; he doesn't look very well.

6. avoid / prevent

Note: Prevent implies taking action; avoid implies staying away.

The police will prevent anyone from leaving the building.

You should travel early to avoid the traffic jams.

7. beside / besides

Come and sit down beside me.

Besides managing the shop, he also teaches in the evening.

8. bring / fetch

Note: These verbs relate to movement.

It's your turn to fetch the children from school.

Don't forget to bring the books to school with you.

9. chance / possibility

Our team has a good chance of winning tonight.

There is always the possibility that the plane will be early.

10. channel / canal

Note: Canal refers to a waterway.

You can take a boat trip around the canals of Amsterdam.

Can you switch the television to Channel 4 for the news?

England and France are separated by the Channel.

11. conduct / direct

Note: Conduct carries the meaning of "carry out."

Von Karajan will conduct the Berlin Symphonic Orchestra at the concert.

It took two policemen to direct the traffic.

12. continuous / continual

She has been in continuous pain for three days.

I am getting fed up with her continual complaints.

13. driver / chauffeur

The chauffeur brought the Rolls Royce to the hotel's main entrance.

He's got a job as a bus driver.

14. formidable / wonderful

Note: Formidable can mean "impressive."

They had a wonderful holiday by a lake in Sweden.

The castle is surrounded by formidable walls and gates.

15. fun / funny

I didn't have much fun on my birthday.

He made funny faces and made the children laugh.

16. go / play

Shall we go jogging or swimming?

Neither. Let's play tennis.

17. come along with / follow

Would you like to come along with me to the cinema tonight?

Make sure the dog doesn't follow me to the shops.

18. harm / damage

Note: Harm is often emotional or personal, while damage is usually physical.

Don't damage my sunglasses if you borrow them.

He didn't mean to harm your little girl.

19. invent / discover

Note: Invent relates to creating something "new."

Did Alexander Fleming discover penicillin?

When did she invent the new computer terminal?

20. job / work

He goes to work every day on his bicycle.

She's got a job in the supermarket.

21. kind / sympathetic

Note: Sympathetic means to show compassion (Arabic: يتعاطف).

You should always be kind to little children.

I'm very sympathetic to her problems.

22. lay / lie

I'm very tired; I'll just go and lie down for a few minutes.

My father is going to lay a new carpet in the dining room.

23. lend / borrow

Can I borrow your car to go to the shops?

He asked me if I would lend him £5 till Monday.

24. nature / countryside

We must try to protect nature and the environment.

The English countryside is beautiful in spring.

25. pass / take

She had to take her driving test three times before she was able to pass.

26. practice / practise

Note: In British English spelling, "-ice" denotes the noun form, and "-ise" denotes the verb form.

You need more practice before you're ready to take the exam.

Don't forget to practise your phrasal verbs.

27. priceless / valueless

Be very careful with that painting; it's priceless.

Her jewels were all imitations; they were quite valueless.

28. principal / principle

She refuses to eat meat on principle.

The principal wants to see you in her office.

The country's principal products are paper and wood.

We talked about the principles of nuclear physics.

29. raise / rise

Does the sun rise in the east or the west?

The airline are going to raise their fares again next year.

30. recipe / receipt

Goods cannot be exchanged unless a sales receipt is shown.

I gave her an Indian recipe book for her birthday.

31. remember / remind

Would you remind me to finish early tonight?

Did you remember to switch off the kitchen light?

32. scenery / view

I adore the beautiful scenery in the Lake District.

You can get a good view of the sea from the church tower.

33. sensible / sensitive

She's very sensitive and is easily upset.

Staying indoors was a sensible thing to do in this terrible weather.

34. take / bring

Can you take this cheque to the bank for me please?

Can I bring my girlfriend here for tea?`;

const blocks = rawText.split('\n\n');
const results = [];
let currentPair = null;

for (let block of blocks) {
  block = block.trim();
  if (!block) continue;
  
  const titleMatch = block.match(/^(\d+)\.\s+(.*)$/);
  if (titleMatch) {
    if (currentPair) results.push(currentPair);
    currentPair = {
      id: parseInt(titleMatch[1]),
      pair: titleMatch[2],
      note: null,
      sentences: []
    };
  } else if (block.startsWith('Note:')) {
    currentPair.note = block.replace('Note:', '').trim();
  } else if (currentPair) {
    const words = currentPair.pair.split('/').map(w => w.trim());
    let answerFound = null;
    let newSentence = block;
    
    words.sort((a,b) => b.length - a.length);
    
    for (const w of words) {
        const regex = new RegExp("\\b" + w + "\\b", "i");
        if (regex.test(newSentence)) {
            const actualMatch = newSentence.match(regex)[0];
            newSentence = newSentence.replace(regex, '___');
            answerFound = actualMatch;
            break;
        }
    }
    
    if (!answerFound) {
      for (const w of words) {
        const regex = new RegExp(w, "i");
        if (regex.test(newSentence)) {
            const actualMatch = newSentence.match(regex)[0];
            newSentence = newSentence.replace(regex, '___');
            answerFound = actualMatch;
            break;
        }
      }
    }

    currentPair.sentences.push({
      text: newSentence,
      answer: answerFound ? answerFound.toLowerCase() : 'TODO'
    });
  }
}
if (currentPair) results.push(currentPair);

fs.writeFileSync('data/confusing.json', JSON.stringify(results, null, 2));
console.log("Done parsing");
