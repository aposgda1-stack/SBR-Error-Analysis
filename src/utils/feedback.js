/**
 * SBR Premium Explanation & Feedback Engine
 * Generates highly focused, context-aware Arabic/English explanations tailored specifically to the question.
 */

export const getArabicExplanation = (question, topicKey) => {
  if (question.arabicExplanation) {
    return question.arabicExplanation;
  }

  const ans = (question.answer || question.correct || '').toLowerCase().trim();
  const sentence = (question.sentence || '').toLowerCase();
  const wrong = (question.wrong || '').toLowerCase();
  const correct = (question.correct || '').toLowerCase();
  
  const allText = `${ans} ${sentence} ${correct} ${wrong}`;

  // 1. Phrasal Verbs Arena
  if (question.rootWord && question.correctParticle) {
    const phrasalVerbExplanations = {
      "cut off": {
        "التعريف والترجمة": "قطع الاتصال / عزل / بتر (Disconnected)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم الفعل التركيبي (cut off) للتعبير عن قطع الاتصال الهاتفي فجأة أو عزل منطقة ما.",
        "التعليل التربوي": "حرف الجر (off) هنا يحمل دلالة الفصل أو الانفصال التام عن الشبكة أو الخط الرئيسي، مما يعبر بدقة عن حالة الانقطاع المطلوبة."
      },
      "cut in": {
        "التعريف والترجمة": "يقاطع كلاماً / ينحرف أمام سيارة أخرى فجأة (Interrupt / drive in front of)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم الفعل التركيبي (cut in) للتعبير عن مقاطعة حديث شخص آخر أو التداخل المفاجئ في حركة المرور بالدخول أمام مركبة أخرى.",
        "التعليل التربوي": "يضفي ظرف (in) معنى الدخول المفاجئ أو التطفل على سياق قائم أو مسار سيارة أخرى."
      },
      "cut down on": {
        "التعريف والترجمة": "يقلل استهلاك شيء (Reduce amount)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم الفعل التركيبي (cut down on) لتقليص استهلاك أو استخدام مادة ما (كالسكر، النفقات، أو السجائر).",
        "التعليل التربوي": "التركيب يدمج (down) للتقليل و(on) لتحديد الشيء المستهلك ليعطي دلالة التخفيض الاختياري للاستهلاك."
      },
      "cut out": {
        "التعريف والترجمة": "يمتنع عن فعل أو تناول شيء تماماً (Stop doing/eating something)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم الفعل التركيبي (cut out) للتعبير عن التوقف التام عن ممارسة عادة معينة أو إيقاف تناول صنف غذائي بالكامل.",
        "التعليل التربوي": "حرف الجر (out) يرمز للاستبعاد والقطع النهائي للشيء وحذفه من نمط الحياة اليومية."
      },
      "cut back": {
        "التعريف والترجمة": "يخفض النفقات أو التكاليف (Spend less)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم الفعل التركيبي (cut back) للتعبير عن تقليل الإنفاق المالي أو خفض معدلات الإنتاج والميزانية.",
        "التعليل التربوي": "يعبر ظرف (back) عن التراجع إلى الوراء والحد من الاتساع المالي لترشيد المصروفات."
      },
      "come across": {
        "التعريف والترجمة": "يصادف بالصدفة / يعثر على شيء دون تخطيط (Find by accident)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come across) للتعبير عن مصادفة شخص أو العثور على شيء مادي أو فكرة بالصدفة البحتة.",
        "التعليل التربوي": "حرف الجر (across) يعطي دلالة التقاطع العرضي في الطرق واللقاء المفاجئ دون تخطيط مسبق."
      },
      "come down with": {
        "التعريف والترجمة": "يصاب بمرض خفيف كالبرد (Become ill)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come down with) للتعبير عن بداية الإصابة بمرض خفيف أو معدٍ (مثل البرد أو الإنفلونزا).",
        "التعليل التربوي": "التركيب يرمز لغوياً إلى سقوط المريض وتأثره بالمرض ودخوله الفراش (down) بصحبة هذا المرض (with)."
      },
      "come up to": {
        "التعريف والترجمة": "يقترب من / يضاهي مستوى متوقع (Approach)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come up to) للتعبير عن الاقتراب الجسدي من شخص أو الارتفاع للوصول إلى مستوى توقعات معين.",
        "التعليل التربوي": "يعبر التركيب عن الصعود أو الارتقاء التدريجي (up) للوصول إلى هدف أو حد مادي أو معنوي (to)."
      },
      "come into": {
        "التعريف والترجمة": "يرث مالاً أو عقاراً (Inherit)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come into) للتعبير عن الحصول على إرث مالي أو عقاري ضخم بعد وفاة قريب.",
        "التعليل التربوي": "يعبر حرف الجر (into) عن الدخول المفاجئ في حيازة الثروة أو انتقال الملكية للوريث."
      },
      "come out in": {
        "التعريف والترجمة": "يظهر عليه طفح جلدي فجأة (Develop a rash)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come out in) في السياق الطبي للتعبير عن ظهور مفاجئ للبثور أو الطفح الجلدي على سطح الجسم.",
        "التعليل التربوي": "حرف الجر (out) يرمز للظهور الخارجي للطفح على سطح الجلد، بينما (in) تصف الحالة المصاحبة للطفح."
      },
      "come up against": {
        "التعريف والترجمة": "يواجه عقبات أو صعوبات غير متوقعة (Deal with a problem)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come up against) للتعبير عن مواجهة عقبات أو مشاكل أو معارضة قوية أثناء تنفيذ مهمة.",
        "التعليل التربوي": "يرمز (against) للتصادم والمقاومة المباشرة للظروف الخارجية الصعبة والعقبات المفاجئة."
      },
      "come through": {
        "التعريف والترجمة": "يصل أو يعبر كرسالة أو موافقة (Message arrives)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come through) للتعبير عن وصول رسالة أو موافقة رسمية منتظرة أو النجاة من تجربة صعبة بنجاح.",
        "التعليل التربوي": "يعبر (through) عن المرور والعبور الآمن للجهة الأخرى بنجاح ووصول المراسلات لخط النهاية."
      },
      "come along": {
        "التعريف والترجمة": "يصاحب / يرافق / يحرز تقدماً (Accompany / arrive)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come along) لحث شخص على الإسراع أو مرافقة الآخرين، كما يعبر عن تطور الأمور أو تحسن الصحة.",
        "التعليل التربوي": "يعطي ظرف (along) طابع الاستمرارية والتوافق والمرافقة في مسار واحد."
      },
      "come off": {
        "التعريف والترجمة": "ينفصل / ينجح وينتهي به الأمر في حالة معينة (End up in a certain state)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come off) للتعبير عن حدوث الشيء ونجاحه (كالخطط)، أو انفصال جزء مادي من مكانه.",
        "التعليل التربوي": "يحمل حرف الجر (off) طابع الانفصال أو التحرر والنجاح في تحقيق النتيجة المرغوبة."
      },
      "come to": {
        "التعريف والترجمة": "يستعيد وعيه بعد إغماء (Regain consciousness)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come to) للتعبير عن استعادة الوعي بعد الإغماء أو التخدير.",
        "التعليل التربوي": "حرف الجر (to) يرمز هنا للعودة والوصول إلى الحالة الطبيعية للوعي والإدراك الحسي الكامل."
      },
      "come up with": {
        "التعريف والترجمة": "يبتكر أو يجد فكرة جديدة (Create something new)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (come up with) للتعبير عن توليد فكرة إبداعية، أو العثور على حل مبتكر لمشكلة.",
        "التعليل التربوي": "يرمز التركيب لغوياً لانتشال الفكرة أو الاقتراح للأعلى (up) من بئر التفكير وطرحه للمناقشة (with)."
      },
      "give away": {
        "التعريف والترجمة": "يكشف سراً / يهب مجاناً (Reveal a secret)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (give away) للتعبير عن إفشاء سر دون قصد، أو التخلي عن ملكية شيء وإهدائه مجاناً.",
        "التعليل التربوي": "يعبر ظرف (away) عن إبعاد الشيء وخروجه من حيازة صاحبه سواء كان سراً أو هبة مادية."
      },
      "give out": {
        "التعريف والترجمة": "يوزع / يتوقف عن العمل نتيجة إجهاد (Distribute)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (give out) للتعبير عن توزيع أشياء بالتساوي على الناس، أو تعطل محرك/عضو جسدي نتيجة الإجهاد.",
        "التعليل التربوي": "يعبر (out) عن الانتشار والتوزيع الخارجي للعامة أو نفاذ الطاقة وتلاشيها تماماً."
      },
      "give up": {
        "التعريف والترجمة": "يستسلم / يتوقف عن المحاولة أو يقلع عن عادة (Stop doing / stop trying)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (give up) للتعبير عن الاستسلام أو التوقف عن المحاولة أو الإقلاع عن عادة سيئة كالتدخين.",
        "التعليل التربوي": "يعبر ظرف (up) عن التخلي التام ورفع الراية وترك المسار الحالي نهائياً."
      },
      "give himself up": {
        "التعريف والترجمة": "يسلم نفسه للشرطة (Surrender to police)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (give himself up) للتعبير عن الاستسلام طواعية للعدالة أو السلطات الأمنية.",
        "التعليل التربوي": "التركيب يعكس التخلي عن الهرب وتفويض النفس وتطهير الموقف بالاستسلام التام."
      },
      "give in": {
        "التعريف والترجمة": "يرضخ / يوافق بعد رفض (Agree after refusing)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (give in) للتعبير عن الاستسلام للضغط والرضوخ لمطالب الآخرين بعد ممانعة طويلة.",
        "التعليل التربوي": "يرمز (in) لغوياً للتراجع والانكماش للداخل وقبول شروط الطرف الآخر."
      },
      "give off": {
        "التعريف والترجمة": "ينبعث منه دخان أو رائحة (Produce smoke/smell)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (give off) للتعبير عن إطلاق أو إنتاج غازات، أو روائح، أو إشعاع حراري بشكل طبيعي.",
        "التعليل التربوي": "يعبر حرف الجر (off) عن انتشار الأبخرة والغازات مبتعدة عن مصدرها الأساسي في الهواء."
      },
      "do with": {
        "التعريف والترجمة": "يحتاج أو يرغب في شيء بشدة (Need / want)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم التركيب (do with) للتعبير عن الحاجة الشديدة لشيء معين أو الرغبة في تحقيقه للحصول على الراحة.",
        "التعليل التربوي": "يحدد حرف الجر (with) موضوع الحاجة المباشرة المرتبطة بالفعل المساعد للتعبير عن كفاية الطلب."
      },
      "do away with": {
        "التعريف والترجمة": "يتخلص من / يلغي تماماً (Get rid of / abolish)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (do away with) للتعبير عن التخلص التام من نظام، أو قانون، أو شيء قديم لم يعد مفيداً.",
        "التعليل التربوي": "يدمج التركيب التباعد (away) مع المعية (with) ليعني الاستغناء والإلغاء النهائي للمصطلح."
      },
      "do up": {
        "التعريف والترجمة": "يربط / يزين ويصلح مكاناً (Fasten / repair and redecorate)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (do up) للتعبير عن تزرير الملابس أو ربط الأحذية، وكذلك لتجديد وصيانة المنازل وتزيينها.",
        "التعليل التربوي": "يضفي ظرف (up) معنى الإتمام والارتقاء الجمالي أو الإحكام المادي للرباط."
      },
      "do in": {
        "التعريف والترجمة": "يقتل / ينهك جسدياً (Kill / exhaust)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (do in) في السياق العامي للتعبير عن التعب الشديد والإنهاك التام، أو القتل والتخلص من شخص.",
        "التعليل التربوي": "يعبر حرف الجر (in) عن محاصرة الجسد بالإنهاك أو الإيقاع به وتصفيته."
      },
      "do without": {
        "التعريف والترجمة": "يستغني عن / يدبر أموره بدون شيء (Manage without)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (do without) للتعبير عن القدرة على العيش أو تدبير الأمور في غياب شيء معين كان يُعتبر ضرورياً.",
        "التعليل التربوي": "يوضح حرف الجر (without) غياب العنصر المستغنى عنه وتجاوز غيابه."
      },
      "make out": {
        "التعريف والترجمة": "يميز بصعوبة / يفهم (See with difficulty / understand)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (make out) للتعبير عن تمييز كتابة غير واضحة، أو رؤية تفاصيل في الظلام، أو استيعاب سلوك شخص ما.",
        "التعليل التربوي": "يعبر ظرف (out) عن استخلاص الفكرة وتوضيحها من الغموض وإخراجها للنور."
      },
      "make up": {
        "التعريف والترجمة": "يخترع قصة / يتصالح (Invent a story)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (make up) للتعبير عن تأليف قصة أو كذبة، أو التصالح بعد شقاق، أو تعويض نقص.",
        "التعليل التربوي": "يعبر ظرف (up) عن البناء والتسوية المكتملة للأمور وسد العجز بالكامل."
      },
      "make up one's mind": {
        "التعريف والترجمة": "يتخذ قراراً نهائياً (Decide)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (make up one's mind) للتعبير عن اتخاذ قرار قاطع وحسم التردد تجاه أمر ما.",
        "التعليل التربوي": "التركيب يرمز لغوياً لإعادة تجميع وتنظيم أفكار العقل (mind) نحو مسار واحد حاسم."
      },
      "make over": {
        "التعريف والترجمة": "ينقل ملكية شيء رسمياً للغير (Transfer property)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (make over) في السياق القانوني للتعبير عن التنازل الرسمي ونقل ملكية العقارات أو الأموال لشخص آخر.",
        "التعليل التربوي": "يعبر ظرف (over) عن تسليم الشيء وتمريره وتجاوز حدوده الجغرافية أو القانونية لصالح الغير."
      },
      "make of": {
        "التعريف والترجمة": "يكون رأياً أو انطباعاً عن شيء (Have an opinion about)",
        "الشرح النحوي (Grammar Rule)": "يُستخدم (make of) لطلب رأي شخص أو معرفة انطباعه وتفسيره لتصرف أو موقف معين.",
        "التعليل التربوي": "يحدد حرف الجر (of) مصدر الانطباع المراد قياسه وتفسيره عقلياً."
      }
    };

    let cleanedParticle = question.correctParticle.toLowerCase().trim();
    // Normalize special multi-word endings
    if (cleanedParticle.includes("one's mind")) cleanedParticle = "up one's mind";
    if (cleanedParticle.includes("himself up")) cleanedParticle = "himself up";

    const fullVerb = `${question.rootWord.toLowerCase().trim()} ${cleanedParticle}`;
    
    if (phrasalVerbExplanations[fullVerb]) {
      return phrasalVerbExplanations[fullVerb];
    }
    
    return {
      "الشرح النحوي (Grammar Rule)": `الفعل التركيبي الصحيح هو "${question.rootWord} ${question.correctParticle}".\nيعني هذا الفعل التركيبي باللغة العربية: (${question.definition || 'المعنى السياقي للمصطلح'}).`,
      "التعليل التربوي": `تم اختيار حرف الجر/الظرف "${question.correctParticle}" ليتحد مع الفعل الأساسي "${question.rootWord}" ليعطي المعنى الدقيق المطلوب سياقياً.`
    };
  }

  // 2. Error Correction Arena / Error Hunter
  if (question.wrong && question.correct) {
    // Find the difference
    const wWords = question.wrong.replace(/[.,!?]$/, '').trim().split(/\s+/);
    const cWords = question.correct.replace(/[.,!?]$/, '').trim().split(/\s+/);
    let start = 0;
    while (start < wWords.length && start < cWords.length && wWords[start] === cWords[start]) start++;
    let endW = wWords.length - 1, endC = cWords.length - 1;
    while (endW >= start && endC >= start && wWords[endW] === cWords[endC]) { endW--; endC--; }
    if (endW < start) endW = start;
    
    const wrongPart = wWords.slice(start, endW + 1).join(' ');
    const correctPart = cWords.slice(start, endC + 1).join(' ');

    return {
      "تحليل الخطأ الشائع (Common Mistake)": `الجملة الخاطئة تحتوي على الاستخدام غير الصحيح للتركيب: "${wrongPart}".`,
      "التعليل والتصحيح": `التركيب الصحيح والمعتمد لغوياً هو "${correctPart}".\nالسبب: يجب تجنب الأخطاء الشائعة المترتبة على الترجمة الحرفية أو الخلط بين حروف الجر المصاحبة للأفعال.`
    };
  }

  // 3. Grammar Arena specific sub-topics
  
  // Can and Could
  if (topicKey?.includes('can_and_could') || allText.includes('can ') || allText.includes("can't") || allText.includes('could') || allText.includes('cannot') || allText.includes('able to')) {
    if (ans.includes("can't") || ans.includes("cannot")) {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لأن السياق يعبر بوضوح عن عدم القدرة أو المنع في الزمن الحاضر (مثل عدم امتلاك رخصة قيادة أو قانون يمنع ذلك).`,
        "القاعدة النحوية": `نستخدم (can't / cannot) للتعبير عن العجز أو عدم إمكانية حدوث الفعل في الوقت الحالي. لا نستخدم do/does للنفي مع الأفعال الناقصة (مثال خاطئ: doesn't can).`
      };
    }
    if (ans.includes("couldn't")) {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (couldn't) لأن الجملة تشير بوضوح إلى عدم القدرة في الزمن الماضي (بسبب الإشارة إلى الأمس أو حدث ماضٍ).`,
        "القاعدة النحوية": `الماضي من can هو could، وبالتالي نفي القدرة في الماضي يكون بـ couldn't.`
      };
    }
    if (ans === "could") {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (could) للتعبير عن القدرة أو الاحتمالية في الزمن الماضي، أو لتقديم اقتراح مهذب في الحاضر.`,
        "القاعدة النحوية": `تستخدم could كصيغة الماضي من can للتعبير عن قدرة عامة كانت موجودة في السابق ولم تعد كذلك.`
      };
    }
    if (ans === "can") {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (can) للتعبير عن القدرة الحالية أو الإمكانية المتاحة في الزمن الحاضر.`,
        "القاعدة النحوية": `تستخدم can للتعبير عن القدرة في الحاضر، وتتبع دائماً بالفعل في المصدر بدون to.`
      };
    }
  }

  // May and Might
  if (topicKey?.includes('may_and_might') || allText.includes('may') || allText.includes('might') || allText.includes('maybe')) {
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) للتعبير عن احتمالية حدوث الفعل في الحاضر أو المستقبل.`,
      "القاعدة النحوية": `تستخدم may و might للتعبير عن إمكانية حدوث الشيء، وتعتبر may أعلى احتمالية بقليل من might. انتبه للفرق بين الفعل الناقص (may be) والظرف (maybe).`
    };
  }

  // Speculation and Deduction
  if (topicKey?.includes('speculation') || (ans === 'must' && (sentence.includes('tired') || sentence.includes('happy') || sentence.includes('sleepy')))) {
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (must) لأن المتحدث يستنتج بشكل شبه مؤكد وبثقة عالية بناءً على الدليل المذكور في الجملة (مثل السهر طوال الليل أو الفوز بالجائزة).`,
      "القاعدة النحوية": `نستخدم (must be) عندما نكون متأكدين بنسبة كبيرة من صحة الاستنتاج في الزمن الحاضر.`
    };
  }

  // Obligation and Necessity
  if (topicKey?.includes('obligation') || ans === 'must' || ans === 'have to' || ans === 'had to' || ans === 'don\'t have to' || ans === 'must not' || ans === 'mustn\'t') {
    if (ans.includes('must not') || ans.includes('mustn\'t')) {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لفرض حظر أو منع صارم وقانوني ضد هذا التصرف.`,
        "القاعدة النحوية": `تُستخدم must not للمنع القاطع والتنبيه لخطورة التصرف أو عدم قانونيته.`
      };
    }
    if (ans.includes('don\'t have to') || ans.includes('do not have to')) {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (don't have to) لأن الأمر اختياري بالكامل وليس هناك أي إلزام أو ضرورة للقيام به (مثل كون اليوم عطلة رسمية).`,
        "القاعدة النحوية": `يعبر don't have to عن غياب الإلزام والحرية التامة في الاختيار.`
      };
    }
    if (ans === 'had to') {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (had to) لأن الضرورة والإلزام حدثا وانتهيا في الزمن الماضي (مثل الإشارة إلى يوم أمس).`,
        "القاعدة النحوية": `الفعل الناقص must لا يملك صيغة ماضي، ولذلك نستخدم had to للتعبير عن الضرورة في الماضي.`
      };
    }
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) للتعبير عن إلزام قوي أو ضرورة حتمية في الوقت الحالي.`,
      "القاعدة النحوية": `تستخدم must للإلزام النابع من المتحدث، بينما have to للإلزام الخارجي المفروض بالقوانين أو الظروف.`
    };
  }

  // Advice and Recommendations
  if (topicKey?.includes('advice') || ans === 'should' || ans === 'shouldn\'t' || ans === 'ought' || ans === 'had better') {
    if (ans === 'ought') {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (ought) لأن الفراغ يتبعه حرف الجر (to) مباشرة (ought to).`,
        "القاعدة النحوية": `الفعل ought هو الفعل الناقص الوحيد الذي يتطلب وجود حرف الجر to بعده للتعبير عن النصيحة.`
      };
    }
    if (ans === 'had better') {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (had better) لإعطاء نصيحة قوية ومحددة يترتب على عدم اتباعها عواقب سلبية.`,
        "القاعدة النحوية": `تُتبع had better دائماً بمصدر الفعل مباشرة بدون to وتفيد التحذير.`
      };
    }
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لتقديم نصيحة أو توصية ودية وهامة بخصوص التصرف الصحيح.`,
      "القاعدة النحوية": `نستخدم should للنصيحة العامة والتعبير عن الرأي الأفضل اخلاقياً أو منطقياً.`
    };
  }

  // Would
  if (topicKey?.includes('would') || ans.includes('would')) {
    if (ans.includes('would like')) {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (would like) لتقديم طلب مهذب أو عرض رسمي بطريقة راقية.`,
        "القاعدة النحوية": `تعتبر would like الصيغة الأكثر أدباً وجمالاً في التواصل المهني مقارنة بـ want.`
      };
    }
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) للتعبير عن نية ماضية (مستقبل في الماضي) أو عادة متكررة كان يتم القيام بها في السابق.`,
      "القاعدة النحوية": `تُستخدم would لوصف الأنشطة المعتادة في الماضي كبديل لـ used to.`
    };
  }

  // Hope vs Wish
  if (topicKey?.includes('hope_vs_wish') || allText.includes('hope') || allText.includes('wish')) {
    if (ans.includes('hope')) {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لأن الأمنية ممكنة وواقعية ولها فرصة كبيرة للتحقق في الحاضر أو المستقبل.`,
        "القاعدة النحوية": `يتبع hope زمن الحاضر البسيط أو المستقبل البسيط للتعبير عن أمنيات واقعية ومحتملة.`
      };
    }
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لأن الأمنية افتراضية أو مستحيلة ومخالفة للواقع الفعلي الحالي (أو تعبر عن ندم ماضٍ).`,
      "القاعدة النحوية": `يتبع wish زمن الماضي البسيط للتعبير عن مواقف غير حقيقية في الحاضر، أو الماضي التام للتعبير عن ندم في الماضي.`
    };
  }

  // Still, Already, Yet
  if (topicKey?.includes('still_already_yet') || allText.includes('still') || allText.includes('already') || allText.includes('yet')) {
    if (ans === 'still') {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (still) للتأكيد على أن الحدث لا يزال مستمراً ولم ينقطع حتى الآن بالرغم من مرور الوقت.`,
        "القاعدة النحوية": `توضع still قبل الفعل الأساسي وبعد الأفعال المساعدة وعادة تفيد الاستمرارية المدهشة.`
      };
    }
    if (ans === 'already') {
      return {
        "التعليل (Reason)": `الخيار الصحيح هو (already) للإشارة إلى أن الحدث قد انتهى بالفعل في وقت أبكر مما كان متوقعاً.`,
        "القاعدة النحوية": `تستخدم already في الجمل الإيجابية للتدليل على إنجاز الشيء مبكراً.`
      };
    }
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (yet) لأن الجملة منفية (أو استفهامية) وتأتي Yet في نهايتها للتعبير عن توقع حدوث الفعل قريباً.`,
      "القاعدة النحوية": `توضع yet دائماً في نهاية الجملة المنفية أو السؤال وتفيد الانتظار والترقب.`
    };
  }

  // Countable vs Uncountable
  if (topicKey?.includes('countable') || allText.includes('advice') || allText.includes('information') || allText.includes('furniture') || allText.includes('scenery')) {
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لأن الكلمة غير معدودة (Uncountable).`,
      "القاعدة النحوية": `الأسماء غير المعدودة (مثل advice, information, furniture) لا تُجمع بإضافة s ولا تسبق بأداة النكرة a/an، وتعامل معاملة المفرد دائماً.`
    };
  }

  // Do vs Make
  if (topicKey?.includes('do_vs_make') || allText.includes('do') || allText.includes('make')) {
    return {
      "التعليل (Reason)": `الخيار الصحيح هو (${ans}) لتشكيل متلازمة لفظية (Collocation) صحيحة مع الاسم المصاحب لها.`,
      "القاعدة النحوية": `نستخدم do للأنشطة والواجبات العامة (مثل do a course, do homework)، ونستخدم make لإنشاء أو ابتكار شيء مادي (مثل make a mistake, make coffee).`
    };
  }

  // Confusing Pairs / False Friends Premium Scientific Academic Explanations
  const confusingExplanations = {
    "actually / now": {
      "الفرق العلمي (Linguistic Contrast)": "actually vs now",
      "التعليل النحوي والأكاديمي": "• actually (حقيقةً/في الواقع): تُستخدم للتأكيد على واقعة حقيقية أو لتصحيح سوء فهم أو فكرة خاطئة.\n• now (الآن): ظرف زمان يشير بدقة إلى اللحظة الراهنة أو الوقت الحاضر."
    },
    "advice / advise": {
      "الفرق العلمي (Linguistic Contrast)": "advice (Noun) vs advise (Verb)",
      "التعليل النحوي والأكاديمي": "• advice (نصيحة): اسم غير معدود (Uncountable Noun) ينتهي بصوت /s/، لا يجمع بإضافة s ولا يسبق بـ a/an.\n• advise (ينصح): فعل متعدٍ (Transitive Verb) ينتهي بصوت /z/، يصف عملية تقديم التوجيه أو النصيحة."
    },
    "affect / effect": {
      "الفرق العلمي (Linguistic Contrast)": "affect (Verb) vs effect (Noun)",
      "التعليل النحوي والأكاديمي": "• affect (يؤثر على): فعل (Verb) يعبر عن إحداث تغيير في شيء ما، ولا يأتي بعده حرف جر.\n• effect (تأثير/أثر): اسم (Noun) يشير إلى النتيجة المترتبة على التغيير، وغالباً ما يتبعه حرف الجر on."
    },
    "already / yet": {
      "الفرق العلمي (Linguistic Contrast)": "already (Positive) vs yet (Negative/Question)",
      "التعليل النحوي والأكاديمي": "• already (بالفعل): ظرف يستخدم في الجمل الإيجابية للتدليل على إتمام حدث قبل الوقت المتوقع.\n• yet (حتى الآن): ظرف يستخدم في نهاية الجمل المنفية والأسئلة للتعبير عن انتظار حدوث شيء ما."
    },
    "afraid of / worried about": {
      "الفرق العلمي (Linguistic Contrast)": "afraid of (Instinctive Fear) vs worried about (Cognitive Anxiety)",
      "التعليل النحوي والأكاديمي": "• afraid of (خائف من): يعبر عن خوف غريزي أو فوبيا من مسبب حسي مباشر (كالظلام أو الأفاعي).\n• worried about (قلق بشأن): يعبر عن انشغال فكري ونفسي بمشكلة أو نتيجة مستقبلية محتملة (كالامتحانات أو الصحة)."
    },
    "avoid / prevent": {
      "الفرق العلمي (Linguistic Contrast)": "avoid (Stay Away) vs prevent (Stop Action)",
      "التعليل النحوي والأكاديمي": "• avoid (يتجنب): اتخاذ موقف بالابتعاد التام عن شخص، مكان، أو مشكلة لتفادي مواجهتها.\n• prevent (يمنع): القيام بفعل استباقي لإيقاف حدوث شيء أو منع شخص من إتمام تصرف ما."
    },
    "beside / besides": {
      "الفرق العلمي (Linguistic Contrast)": "beside (Location) vs besides (Addition)",
      "التعليل النحوي والأكاديمي": "• beside (بجانب): حرف جر مكاني يعني الملاصقة أو الجوار الجغرافي.\n• besides (علاوة على/بالإضافة إلى): أداة ربط تفيد الإضافة أو استثناء شيء ما."
    },
    "bring / fetch": {
      "الفرق العلمي (Linguistic Contrast)": "bring (One-way movement) vs fetch (Two-way movement)",
      "التعليل النحوي والأكاديمي": "• bring (يُحضر): جلب الشيء بصحبة الشخص من نقطة انطلاقه إلى موقع المتحدث الحالي (حركة باتجاه واحد).\n• fetch (يذهب ليُحضر): الذهاب من موقع المتحدث إلى مكان الشيء، والتقاطه، ثم العودة به (حركة ذهاب وإياب)."
    },
    "chance / possibility": {
      "الفرق العلمي (Linguistic Contrast)": "chance (Opportunity/Fortune) vs possibility (Neutral Probability)",
      "التعليل النحوي والأكاديمي": "• chance (فرصة/احتمال نجاح): يعبر غالباً عن فرصة مواتية، حظ سعيد، أو احتمال إيجابي مرغوب.\n• possibility (إمكانية حدوث): احتمال علمي محايد يشير إلى إمكانية وقوع الشيء من الناحية النظرية أو العملية."
    },
    "channel / canal": {
      "الفرق العلمي (Linguistic Contrast)": "channel (Natural/TV) vs canal (Man-made waterway)",
      "التعليل النحوي والأكاديمي": "• channel (قناة): مجرى مائي طبيعي واسع (كالقناة الإنجليزية)، أو قناة تلفزيونية/اتصالية.\n• canal (ترعة/قناة صناعية): ممر مائي صناعي شقه الإنسان لأغراض الملاحة أو الري (مثل قناة السويس)."
    },
    "conduct / direct": {
      "الفرق العلمي (Linguistic Contrast)": "conduct (Execute/Lead) vs direct (Guide traffic/film)",
      "التعليل النحوي والأكاديمي": "• conduct (يجري/يقود): يحمل معنى تنفيذ نشاط منظم (conduct a test) أو قيادة فرقة موسيقية.\n• direct (يوجه/يخرج): يعني تنظيم حركة سير (direct traffic) أو إرشاد مسار معين أو إخراج عمل فني."
    },
    "continuous / continual": {
      "الفرق العلمي (Linguistic Contrast)": "continuous (Unbroken) vs continual (Repeated intervals)",
      "التعليل النحوي والأكاديمي": "• continuous (متواصل): مستمر بلا أي انقطاع زمني على الإطلاق (ألم متواصل لثلاثة أيام).\n• continual (متكرر): يحدث بشكل متتابع ومتكرر على فترات زمنية متعاقبة (شكاوى متواصلة/متكررة)."
    },
    "driver / chauffeur": {
      "الفرق العلمي (Linguistic Contrast)": "driver (General) vs chauffeur (Professional luxury)",
      "التعليل النحوي والأكاديمي": "• driver (سائق): مصطلح عام لأي شخص يقود مركبة (سائق حافلة، تاكسي، إلخ).\n• chauffeur (سائق خاص): سائق محترف يرتدي زياً رسمياً لخدمة ملاك السيارات الفاخرة أو الليموزين."
    },
    "formidable / wonderful": {
      "الفرق العلمي (Linguistic Contrast)": "formidable (Awe-inspiring/Difficult) vs wonderful (Delightful)",
      "التعليل النحوي والأكاديمي": "• formidable (مهيب/هائل): يثير الإعجاب الممزوج بالخوف لصعوبته أو حجمه (مثل أسوار قلعة منيعة).\n• wonderful (رائع/بديع): يبعث على البهجة والسرور والارتياح الكامل (مثل عطلة ممتعة)."
    },
    "fun / funny": {
      "الفرق العلمي (Linguistic Contrast)": "fun (Pleasure) vs funny (Humorous/Strange)",
      "التعليل النحوي والأكاديمي": "• fun (متعة): تشير إلى التسلية وقضاء وقت ممتع ونشاط سار.\n• funny (مضحك/غريب): يثير الضحك أو يدعو للاستغراب والريبة."
    },
    "go / play": {
      "الفرق العلمي (Linguistic Contrast)": "go (+ -ing) vs play (Competitive sports/Ball)",
      "التعليل النحوي والأكاديمي": "• go: تستخدم مع الرياضات والأنشطة الترفيهية المنتهية بـ -ing (مثل go swimming, go jogging).\n• play: تستخدم مع الألعاب الرياضية التنافسية أو التي تلعب بالكرة (مثل play tennis, play football)."
    },
    "come along with / follow": {
      "الفرق العلمي (Linguistic Contrast)": "come along with (Accompany voluntarily) vs follow (Walk behind)",
      "التعليل النحوي والأكاديمي": "• come along with (يرافق): الذهاب مع شخص كصديق أو بموافقته طواعية.\n• follow (يتبع): السير خلف شخص ما (قد يكون بدون إذنه، أو لتتبع خطاه)."
    },
    "harm / damage": {
      "الفرق العلمي (Linguistic Contrast)": "harm (Living things) vs damage (Non-living objects)",
      "التعليل النحوي والأكاديمي": "• harm (يؤذي/يضر): يطلق على الضرر الجسدي، النفسي، أو الأخلاقي للكائنات الحية.\n• damage (يتلف): يطلق على الخسائر والتلفيات الفيزيائية التي تصيب الجمادات والأشياء المادية."
    },
    "invent / discover": {
      "الفرق العلمي (Linguistic Contrast)": "invent (Create new) vs discover (Find existing)",
      "التعليل النحوي والأكاديمي": "• invent (يخترع): ابتكار وتصميم شيء جديد كلياً لم يكن له وجود سابق في الطبيعة.\n• discover (يكتشف): العثور لأول مرة على شيء موجود بالفعل في الكون ولكنه كان مجهولاً."
    },
    "job / work": {
      "الفرق العلمي (Linguistic Contrast)": "job (Countable Noun) vs work (Uncountable Noun)",
      "التعليل النحوي والأكاديمي": "• job (وظيفة): اسم معدود يشير إلى منصب مهني محدد يتلقى عليه الشخص أجراً.\n• work (عمل): اسم غير معدود يعبر عن النشاط أو الجهد المبذول لإنجاز مهمة ما."
    },
    "kind / sympathetic": {
      "الفرق العلمي (Linguistic Contrast)": "kind (Generous/Gentle) vs sympathetic (Compassionate listener)",
      "التعليل النحوي والأكاديمي": "• kind (طيب/لطيف): رقيق في تعامله ومستعد دائماً لتقديم المساعدة المادية أو المعنوية.\n• sympathetic (متعاطف): يظهر المواساة والتفهم والمشاركة الوجدانية لهموم ومشاكل الآخرين."
    },
    "lay / lie": {
      "الفرق العلمي (Linguistic Contrast)": "lay (Transitive - Needs Object) vs lie (Intransitive)",
      "التعليل النحوي والأكاديمي": "• lay (يضع/يفرش): فعل متعدٍ يتطلب مفعولاً به مباشراً (مثل lay a carpet, lay an egg). تصريفه: lay, laid, laid.\n• lie (يستلقي): فعل لازم لا يأخذ مفعولاً به، ويأتي بعده ظرف أو حرف جر (مثل lie down). تصريفه: lie, lay, lain."
    },
    "lend / borrow": {
      "الفرق العلمي (Linguistic Contrast)": "lend (Give out) vs borrow (Take in)",
      "التعليل النحوي والأكاديمي": "• lend (يُقرض/يُعير): إعطاء شيء يخصك لشخص آخر بشكل مؤقت (حركة خارجة من عندك).\n• borrow (يستعير/يستلف): أخذ شيء من شخص آخر لاستخدامه مؤقتاً ثم إعادته (حركة داخلة إليك)."
    },
    "nature / countryside": {
      "الفرق العلمي (Linguistic Contrast)": "nature (Universal environment) vs countryside (Rural areas)",
      "التعليل النحوي والأكاديمي": "• nature (الطبيعة): القوة الحيوية التي تشمل الحياة البرية، الجيولوجيا، والكون والبيئة العامة.\n• countryside (الريف): المناطق الخضراء، المزارع، والحقول التي تقع خارج حدود المدن والمناطق السكنية."
    },
    "pass / take": {
      "الفرق العلمي (Linguistic Contrast)": "pass (Succeed) vs take (Participate/Attempt)",
      "التعليل النحوي والأكاديمي": "• pass (يجتاز/ينجح): تحقيق العلامة المطلوبة واجتياز الاختبار بنجاح.\n• take (يؤدي/يدخل الامتحان): الجلوس لقاعة الامتحان وأداء الاختبار (ولا تعني بالضرورة النجاح فيه)."
    },
    "practice / practise": {
      "الفرق العلمي (Linguistic Contrast)": "practice (Noun) vs practise (Verb) [British English]",
      "التعليل النحوي والأكاديمي": "• practice (ممارسة): اسم ينتهي بـ -ice ويعبر عن النشاط الفعلي للتمرين.\n• practise (يمارس): فعل ينتهي بـ -ise ويعبر عن القيام بعملية التدريب والتمرن المستمر."
    },
    "priceless / valueless": {
      "الفرق العلمي (Linguistic Contrast)": "priceless (Extremely high value) vs valueless (Zero value)",
      "التعليل النحوي والأكاديمي": "• priceless (نفيس/لا يقدّر بثمن): ذو قيمة معنوية أو تاريخية أو جمالية هائلة تفوق أي تقدير مالي.\n• valueless (عديم القيمة): تافه ولا قيمة مادية أو نفعية له على الإطلاق."
    },
    "principal / principle": {
      "الفرق العلمي (Linguistic Contrast)": "principal (Main/Director) vs principle (Moral/Rule)",
      "التعليل النحوي والأكاديمي": "• principal (رئيسي/مدير): صفة تعني الأكثر أهمية، أو اسم يعني مدير المؤسسة التعليمية.\n• principle (مبدأ/قانون): اسم يعبر عن قيمة أخلاقية، عقيدة، أو قانون علمي راسخ."
    },
    "raise / rise": {
      "الفرق العلمي (Linguistic Contrast)": "raise (Transitive - Needs Object) vs rise (Intransitive)",
      "التعليل النحوي والأكاديمي": "• raise (يرفع): فعل متعدٍ يتطلب مفعولاً به يقع عليه الفعل (مثل raise prices, raise your hand). تصريفه منتظم.\n• rise (يرتفع/يشرق): فعل لازم يحدث ذاتياً دون الحاجة لمفعول به (مثل rise in the east, temperatures rise)."
    },
    "recipe / receipt": {
      "الفرق العلمي (Linguistic Contrast)": "recipe (Cooking formula) vs receipt (Proof of payment)",
      "التعليل النحوي والأكاديمي": "• recipe (وصفة طعام): الإرشادات والمكونات اللازمة لإعداد وجبة أو طبق معين.\n• receipt (إيصال استلام): وثيقة ورقية أو إلكترونية تثبت دفع ثمن السلعة أو استلامها."
    },
    "remember / remind": {
      "الفرق العلمي (Linguistic Contrast)": "remember (Internal memory) vs remind (External trigger)",
      "التعليل النحوي والأكاديمي": "• remember (يتذكر): استحضار فكرة أو معلومة من الذاكرة داخلياً بشكل ذاتي.\n• remind (يُذكّر): قيام طرف خارجي (شخص أو منبه) بتنبيهك للقيام بشيء ما."
    },
    "scenery / view": {
      "الفرق العلمي (Linguistic Contrast)": "scenery (General landscape) vs view (Specific outlook)",
      "التعليل النحوي والأكاديمي": "• scenery (المشاهد الطبيعية): المظهر العام للمظاهر الطبيعية في إقليم ما (مثل البحيرات والجبال).\n• view (الإطلالة/المنظر): ما يمكن رؤيته بالعين البصرية من نقطة رصد معينة وفي اتجاه محدد."
    },
    "sensible / sensitive": {
      "الفرق العلمي (Linguistic Contrast)": "sensible (Rational/Wise) vs sensitive (Easily hurt/Emotional)",
      "التعليل النحوي والأكاديمي": "• sensible (عقلاني/حكيم): يتصرف برجاحة عقل ومنطق سليم متجنباً الحماقات.\n• sensitive (حساس): سريع التأثر بالمؤثرات الخارجية ومشاعره تنجرح بسهولة، أو يملك استجابة حسية عالية."
    },
    "take / bring": {
      "الفرق العلمي (Linguistic Contrast)": "take (Movement away) vs bring (Movement towards)",
      "التعليل النحوي والأكاديمي": "• take (يأخذ): نقل الشيء أو الذهاب به بعيداً عن موقع المتحدث الحالي.\n• bring (يجلب/يُحضر): نقل الشيء أو إحضاره باتجاه موقع المتحدث الحالي أو بصحبته إليه."
    }
  };

  // Extract pair key if available
  let matchedPairKey = null;
  if (topicKey && topicKey.includes('Pair')) {
    const pairPart = topicKey.split(': ')[1]?.trim().toLowerCase();
    if (pairPart && confusingExplanations[pairPart]) {
      matchedPairKey = pairPart;
    }
  }

  // Fallback to searching words inside allText if title format is different
  if (!matchedPairKey) {
    const matchedKey = Object.keys(confusingExplanations).find(k => {
      const parts = k.split(' / ');
      return parts.every(part => allText.includes(part));
    });
    if (matchedKey) {
      matchedPairKey = matchedKey;
    }
  }

  if (matchedPairKey) {
    return confusingExplanations[matchedPairKey];
  }

  // Fallback for general fill-in-the-blank questions
  return {
    "التعليل (Reason)": `الخيار الصحيح للفراغ هو (${ans}) لتناسب المعنى السياقي والتركيبي للجملة بشكل دقيق.`,
    "القاعدة النحوية": `تم اختيار هذا اللفظ ليتطابق مع القواعد النحوية ومستوى الدقة المتبع في منهاج SBR الأكاديمي.`
  };
};
