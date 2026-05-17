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

  // Fallback for general fill-in-the-blank questions
  return {
    "التعليل (Reason)": `الخيار الصحيح للفراغ هو (${ans}) لتناسب المعنى السياقي والتركيبي للجملة بشكل دقيق.`,
    "القاعدة النحوية": `تم اختيار هذا اللفظ ليتطابق مع القواعد النحوية ومستوى الدقة المتبع في منهاج SBR الأكاديمي.`
  };
};
