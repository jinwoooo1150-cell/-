export interface QuizQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface RelatedExamQuestion {
  id: string;
  sourceTitle: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface CharacterRelation {
  from: string;
  to: string;
  type: "supporter" | "antagonist" | "family" | "neutral";
  label: string;
}

export interface CharacterMapData {
  characters: { name: string; role: string; description: string }[];
  relations: CharacterRelation[];
}

export type NarrativePhase = "exposition" | "rising" | "climax" | "falling" | "resolution";

export interface NarrativeSection {
  phase: NarrativePhase;
  title: string;
  summary: string;
}

export type GrandUnit = "literature" | "non_fiction";

export interface QuizPassage {
  id: string;
  grandUnit: GrandUnit;
  categoryId: string;
  title: string;
  author: string;
  source: string;
  passage: string;
  originalText?: string;
  modernText?: string;
  questions: QuizQuestion[];
  relatedExams?: RelatedExamQuestion[];
  narrativePhase?: NarrativePhase;
  narrativeSections?: NarrativeSection[];
  characterMap?: CharacterMapData;
}

export const grandUnitConfig = {
  literature: {
    id: "literature" as GrandUnit,
    name: "문학",
    nameEn: "Literature",
    categories: ["modern-poem", "modern-novel", "classic-poetry", "classic-novel"],
  },
  non_fiction: {
    id: "non_fiction" as GrandUnit,
    name: "독서",
    nameEn: "Non-fiction",
    categories: [],
  },
};

export function getQuizzesByGrandUnit(grandUnit: GrandUnit): QuizPassage[] {
  return quizPassages.filter((q) => q.grandUnit === grandUnit);
}

export const quizPassages: QuizPassage[] = [
  {
    id: "classic-novel-yucr-1",
    grandUnit: "literature",
    categoryId: "classic-novel",
    title: "유충렬전",
    author: "작자 미상",
    source: "수능특강 문학 112p",
    passage:
      "충렬이 나이 겨우 다섯 살이라. 어머니 장씨 부인이 아이를 안고 피란하다가 정한담의 군사에게 잡히니, 장씨 부인은 바위 아래로 몸을 던져 목숨을 끊으려 하거늘, 하늘이 이 충신의 자식을 버리지 아니하여 한 줄기 오색 구름이 내려와 아이를 감싸니, 군사들이 놀라 물러가더라.\n\n이때 한 노승이 지나다가 아이의 울음소리를 듣고 찾아와 안아 들고 탄식하여 왈,\n\"이 아이는 장차 나라를 구할 재목이로다. 내 마땅히 데려가 기르리라.\"\n하고 아이를 업고 깊은 산중으로 들어가니라.",
    narrativePhase: "exposition",
    narrativeSections: [
      { phase: "exposition", title: "유충렬의 위기", summary: "어린 충렬이 역적 정한담의 난으로 가족을 잃고 노승에게 구출됨" },
      { phase: "rising", title: "성장과 수련", summary: "산중에서 무예와 학문을 연마하며 영웅으로 성장" },
      { phase: "climax", title: "전장의 영웅", summary: "조정의 위기에 출전하여 적장들을 차례로 격파" },
      { phase: "falling", title: "정한담 토벌", summary: "역적 정한담을 정벌하고 부모의 원수를 갚음" },
      { phase: "resolution", title: "충효의 완성", summary: "공을 인정받아 벼슬에 오르고 부모와 재회" },
    ],
    characterMap: {
      characters: [
        { name: "유충렬", role: "주인공", description: "충신 유심의 아들, 영웅적 장수" },
        { name: "유심", role: "아버지", description: "충신, 정한담의 모함으로 유배" },
        { name: "장씨 부인", role: "어머니", description: "충렬의 어머니, 절개를 지킴" },
        { name: "정한담", role: "적대자", description: "간신, 나라를 어지럽히는 역적" },
        { name: "노승", role: "조력자", description: "충렬을 구하고 무예를 가르침" },
        { name: "임금", role: "군주", description: "위기에 처한 조정의 왕" },
      ],
      relations: [
        { from: "유충렬", to: "유심", type: "family", label: "부자" },
        { from: "유충렬", to: "장씨 부인", type: "family", label: "모자" },
        { from: "유충렬", to: "노승", type: "supporter", label: "스승-제자" },
        { from: "유충렬", to: "정한담", type: "antagonist", label: "적대" },
        { from: "유충렬", to: "임금", type: "supporter", label: "충성" },
        { from: "정한담", to: "유심", type: "antagonist", label: "모함" },
        { from: "정한담", to: "임금", type: "antagonist", label: "반역" },
      ],
    },
    questions: [
      {
        id: "cn-yucr1-q1",
        statement: "'오색 구름'은 하늘이 유충렬을 보호하는 초월적 존재임을 나타낸다.",
        isTrue: true,
        explanation:
          "오색 구름은 천상적 존재의 개입을 상징하며, 유충렬이 하늘의 보호를 받는 비범한 인물임을 보여줍니다. 이는 영웅소설의 전형적인 '천우신조(天佑神助)' 모티프입니다.",
      },
      {
        id: "cn-yucr1-q2",
        statement: "장씨 부인이 바위 아래로 몸을 던지려 한 것은 비겁한 도주의 행위이다.",
        isTrue: false,
        explanation:
          "장씨 부인의 행위는 비겁한 도주가 아니라, 적에게 잡혀 욕을 당하느니 목숨을 끊겠다는 열녀의 절개를 보여주는 것입니다. 이는 유교적 가치관에서 높이 평가되는 행위입니다.",
      },
      {
        id: "cn-yucr1-q3",
        statement: "노승은 유충렬의 미래 역할을 예견하는 인물이다.",
        isTrue: true,
        explanation:
          "'장차 나라를 구할 재목'이라는 노승의 말은 예언적 기능을 합니다. 영웅소설에서 조력자가 주인공의 비범함을 알아보고 양육하는 것은 전형적 서사 구조입니다.",
      },
      {
        id: "cn-yucr1-q4",
        statement: "이 장면은 시간의 흐름에 따라 사건이 순차적으로 전개되고 있다.",
        isTrue: true,
        explanation:
          "피란 → 포위 → 장씨 부인의 결심 → 오색 구름의 구원 → 노승의 등장 순으로 시간 순서에 따라 사건이 전개되며, 이는 고전소설의 전형적인 순행적 구조입니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-yucr1-1",
        sourceTitle: "2024학년도 수능",
        statement: "고전 영웅소설에서 주인공의 고난은 후일 영웅적 활약의 서사적 필연성을 갖는다.",
        isTrue: true,
        explanation:
          "영웅소설의 주인공이 어린 시절 겪는 고난(가족 이산, 생명 위협)은 이후 영웅으로 성장하여 원수를 갚고 나라를 구하는 서사의 필연적 전제가 됩니다. '고난 → 성장 → 활약'의 구조입니다.",
      },
      {
        id: "re-yucr1-2",
        sourceTitle: "2023학년도 6월 평가원",
        statement: "이 작품의 서술자는 전지적 시점에서 인물의 내면까지 서술하고 있다.",
        isTrue: false,
        explanation:
          "이 장면에서 서술자는 인물의 행동과 외적 상황을 서술할 뿐, 내면 심리를 직접 서술하지 않습니다. '목숨을 끊으려 하거늘'은 행동 묘사이지 내면 서술이 아닙니다.",
      },
    ],
  },
  {
    id: "classic-novel-yucr-2",
    grandUnit: "literature",
    categoryId: "classic-novel",
    title: "유충렬전",
    author: "작자 미상",
    source: "수능특강 문학 115p",
    passage:
      "충렬이 산중에서 십여 년을 지내며 노승에게 병법과 무예를 배우니, 열여덟 가지 무예에 통달하고 천문지리에 밝아 진실로 만부부당(萬夫不當)의 용맹을 갖추었더라.\n\n하루는 노승이 충렬을 불러 왈,\n\"네 이제 세상에 나가 뜻을 펼 때가 되었느니라. 너의 아버지 유심은 정한담의 모함으로 남쪽 땅에 귀양 가 계시고, 나라는 역적의 손에 위태로우니, 네 마땅히 임금을 도와 역적을 치고 아버지를 구하라.\"\n충렬이 눈물을 흘리며 큰 절을 올리고 하산하니, 이때 나이 열여섯이라.",
    narrativePhase: "rising",
    narrativeSections: [
      { phase: "exposition", title: "유충렬의 위기", summary: "어린 충렬이 역적 정한담의 난으로 가족을 잃고 노승에게 구출됨" },
      { phase: "rising", title: "성장과 수련", summary: "산중에서 무예와 학문을 연마하며 영웅으로 성장" },
      { phase: "climax", title: "전장의 영웅", summary: "조정의 위기에 출전하여 적장들을 차례로 격파" },
      { phase: "falling", title: "정한담 토벌", summary: "역적 정한담을 정벌하고 부모의 원수를 갚음" },
      { phase: "resolution", title: "충효의 완성", summary: "공을 인정받아 벼슬에 오르고 부모와 재회" },
    ],
    characterMap: {
      characters: [
        { name: "유충렬", role: "주인공", description: "충신 유심의 아들, 영웅적 장수" },
        { name: "유심", role: "아버지", description: "충신, 정한담의 모함으로 유배" },
        { name: "정한담", role: "적대자", description: "간신, 나라를 어지럽히는 역적" },
        { name: "노승", role: "조력자", description: "충렬을 구하고 무예를 가르침" },
        { name: "임금", role: "군주", description: "위기에 처한 조정의 왕" },
      ],
      relations: [
        { from: "유충렬", to: "유심", type: "family", label: "부자" },
        { from: "유충렬", to: "노승", type: "supporter", label: "스승-제자" },
        { from: "유충렬", to: "정한담", type: "antagonist", label: "적대" },
        { from: "유충렬", to: "임금", type: "supporter", label: "충성" },
        { from: "정한담", to: "유심", type: "antagonist", label: "모함" },
      ],
    },
    questions: [
      {
        id: "cn-yucr2-q1",
        statement: "'만부부당(萬夫不當)'은 충렬의 뛰어난 무예 실력을 강조하는 표현이다.",
        isTrue: true,
        explanation:
          "만부부당(萬夫不當)은 '만 명의 적도 당해내지 못한다'는 뜻으로, 유충렬의 압도적인 무예 실력을 과장법을 통해 강조하는 영웅소설의 전형적 표현입니다.",
      },
      {
        id: "cn-yucr2-q2",
        statement: "노승이 충렬에게 하산을 권하는 것은 충렬의 '충(忠)'과 '효(孝)'를 동시에 실현하게 하려는 것이다.",
        isTrue: true,
        explanation:
          "'임금을 도와 역적을 치고(충)' '아버지를 구하라(효)'는 노승의 말에서 충과 효의 동시 실현이라는 유교적 이상이 제시됩니다. 이는 조선 시대 영웅소설의 핵심 가치관입니다.",
      },
      {
        id: "cn-yucr2-q3",
        statement: "충렬이 산중에서 십여 년간 수련한 것은 현실적인 시간 경과를 반영한다.",
        isTrue: false,
        explanation:
          "고전 영웅소설에서 주인공의 수련 기간은 현실적 시간보다는 서사적 관습에 따른 것입니다. 비현실적으로 짧은 시간에 모든 무예를 익히는 것은 영웅의 비범함을 강조하는 장치입니다.",
      },
      {
        id: "cn-yucr2-q4",
        statement: "이 장면에서 충렬의 눈물은 노승과의 이별에 대한 슬픔만을 의미한다.",
        isTrue: false,
        explanation:
          "충렬의 눈물은 노승과의 이별 슬픔뿐 아니라, 고난받는 아버지에 대한 효심, 나라의 위기에 대한 충의, 그리고 사명감이 복합적으로 표출된 것입니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-yucr2-1",
        sourceTitle: "2022학년도 수능",
        statement: "영웅소설에서 주인공의 하산은 개인적 성장의 완료와 사회적 역할 시작을 의미한다.",
        isTrue: true,
        explanation:
          "하산은 산중 수련(개인적 성장)의 완료를 상징하며, 세상으로 나가 충과 효를 실현하는 사회적 역할의 시작을 의미합니다. 이는 '성장 → 시련 → 활약'의 전환점입니다.",
      },
      {
        id: "re-yucr2-2",
        sourceTitle: "2021학년도 9월 평가원",
        statement: "노승의 예언은 작품 전체 서사의 방향을 제시하는 서사적 장치이다.",
        isTrue: true,
        explanation:
          "노승이 제시하는 과업(역적 토벌, 아버지 구출)은 이후 작품 서사의 핵심 줄기를 미리 알려주는 '복선' 및 '예언'의 서사적 장치로 기능합니다.",
      },
    ],
  },
  {
    id: "classic-novel-yucr-3",
    grandUnit: "literature",
    categoryId: "classic-novel",
    title: "유충렬전",
    author: "작자 미상",
    source: "수능완성 문학 98p",
    passage:
      "이때 정한담이 대군을 이끌고 도성을 위협하니, 조정이 크게 놀라 장수를 구하나 대적할 자 없더라. 충렬이 도성에 이르러 임금 앞에 나아가 아뢰되,\n\"소장이 비록 나이 어리오나 일편단심 충의로써 역적을 소탕하겠나이다.\"\n임금이 크게 기뻐하여 충렬을 대원수에 봉하고 군사 십만을 내어주시니, 충렬이 삼군을 호령하여 출전하매 위풍이 늠름하여 산천이 떨리고 적진이 두려워하더라.",
    narrativePhase: "climax",
    narrativeSections: [
      { phase: "exposition", title: "유충렬의 위기", summary: "어린 충렬이 역적 정한담의 난으로 가족을 잃고 노승에게 구출됨" },
      { phase: "rising", title: "성장과 수련", summary: "산중에서 무예와 학문을 연마하며 영웅으로 성장" },
      { phase: "climax", title: "전장의 영웅", summary: "조정의 위기에 출전하여 적장들을 차례로 격파" },
      { phase: "falling", title: "정한담 토벌", summary: "역적 정한담을 정벌하고 부모의 원수를 갚음" },
      { phase: "resolution", title: "충효의 완성", summary: "공을 인정받아 벼슬에 오르고 부모와 재회" },
    ],
    characterMap: {
      characters: [
        { name: "유충렬", role: "주인공", description: "충신 유심의 아들, 영웅적 장수" },
        { name: "정한담", role: "적대자", description: "간신, 나라를 어지럽히는 역적" },
        { name: "임금", role: "군주", description: "위기에 처한 조정의 왕" },
      ],
      relations: [
        { from: "유충렬", to: "임금", type: "supporter", label: "충성" },
        { from: "유충렬", to: "정한담", type: "antagonist", label: "적대" },
        { from: "정한담", to: "임금", type: "antagonist", label: "반역" },
      ],
    },
    questions: [
      {
        id: "cn-yucr3-q1",
        statement: "'일편단심'이라는 표현은 충렬의 변하지 않는 충성심을 강조한다.",
        isTrue: true,
        explanation:
          "일편단심(一片丹心)은 '한 조각 붉은 마음'이라는 뜻으로, 유충렬의 변함없는 충성심을 강조합니다. 이는 영웅의 덕목 중 '충(忠)'을 부각하는 관용적 표현입니다.",
      },
      {
        id: "cn-yucr3-q2",
        statement: "'산천이 떨리고'라는 표현은 실제 지진 현상을 묘사한 것이다.",
        isTrue: false,
        explanation:
          "이는 과장법(夸張法)을 사용하여 유충렬의 위풍당당한 모습과 군세의 위엄을 극대화한 표현입니다. 영웅소설에서 자연 현상을 빌어 영웅의 위상을 과장하는 것은 전형적 수사법입니다.",
      },
      {
        id: "cn-yucr3-q3",
        statement: "임금이 어린 충렬을 대원수에 봉한 것은 인재 부족이라는 상황적 필연성에 기인한다.",
        isTrue: true,
        explanation:
          "'장수를 구하나 대적할 자 없더라'는 상황은 나이 어린 충렬이 대원수가 되는 서사적 필연성을 제공합니다. 위기 상황이 영웅 등장의 배경이 되는 것은 영웅소설의 전형적 구조입니다.",
      },
      {
        id: "cn-yucr3-q4",
        statement: "이 장면은 영웅소설의 '위기-영웅 등장-문제 해결' 서사 구조를 보여준다.",
        isTrue: true,
        explanation:
          "정한담의 위협(위기) → 유충렬의 등장(영웅 등장) → 출전(문제 해결 시작)이라는 영웅소설의 전형적 서사 공식이 이 장면에 집약되어 있습니다.",
      },
    ],
  },
  {
    id: "modern-poem-1",
    grandUnit: "literature",
    categoryId: "modern-poem",
    title: "진달래꽃",
    author: "김소월",
    source: "수능특강 문학 45p",
    passage:
      "나 보기가 역겨워\n가실 때에는\n말없이 고이 보내 드리우리다\n\n영변에 약산\n진달래꽃\n아름 따다 가실 길에 뿌리우리다\n\n가시는 걸음걸음\n놓인 그 꽃을\n사뿐히 즈려밟고 가시옵소서\n\n나 보기가 역겨워\n가실 때에는\n죽어도 아니 눈물 흘리우리다",
    questions: [
      {
        id: "mp1-q1",
        statement: "이 시의 화자는 임과의 이별을 체념적으로 수용하고 있다.",
        isTrue: false,
        explanation:
          "화자는 겉으로는 체념한 듯 보이지만, '죽어도 아니 눈물 흘리우리다'라는 역설적 표현을 통해 이별의 슬픔을 극대화하고 있습니다.",
      },
      {
        id: "mp1-q2",
        statement: "이 시는 7·5조의 전통적 민요 율격을 활용하고 있다.",
        isTrue: true,
        explanation:
          "김소월의 시는 한국 전통 민요의 7·5조 율격을 바탕으로 하여 한국적 정서를 효과적으로 전달하고 있습니다.",
      },
      {
        id: "mp1-q3",
        statement: "'진달래꽃'은 화자의 기쁨과 희망을 상징하는 소재이다.",
        isTrue: false,
        explanation:
          "진달래꽃은 화자의 사랑과 헌신을 상징합니다. 떠나는 임의 길에 꽃을 뿌린다는 것은 슬픔을 내면화하는 행위입니다.",
      },
      {
        id: "mp1-q4",
        statement: "이 시에서 화자는 자신의 감정을 행동으로 간접 전달하고 있다.",
        isTrue: true,
        explanation:
          "'고이 보내 드리우리다', '가실 길에 뿌리우리다' 등 구체적인 행동 묘사를 통해 감정을 간접적으로 전달하고 있습니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp1-1",
        sourceTitle: "2023학년도 수능",
        statement: "화자가 꽃을 뿌리는 행위는 이별의 슬픔을 의식적으로 억제하려는 태도를 보여준다.",
        isTrue: true,
        explanation:
          "화자는 이별의 고통을 겉으로 드러내지 않고, 꽃을 뿌리는 행위를 통해 아름다운 이별을 연출하면서 슬픔을 내면화하고 있습니다.",
      },
      {
        id: "re-mp1-2",
        sourceTitle: "2022학년도 9월 평가원",
        statement: "'사뿐히 즈려밟고'는 화자가 임에게 고통을 주고 싶은 마음을 표현한 것이다.",
        isTrue: false,
        explanation:
          "이는 임에게 고통을 주려는 것이 아니라, 임의 발걸음을 편안하게 해주려는 자기희생적 사랑의 역설적 표현입니다.",
      },
    ],
  },
  {
    id: "modern-poem-2",
    grandUnit: "literature",
    categoryId: "modern-poem",
    title: "서시",
    author: "윤동주",
    source: "수능특강 문학 78p",
    passage:
      "죽는 날까지 하늘을 우러러\n한 점 부끄럼이 없기를,\n잎새에 이는 바람에도\n나는 괴로워했다.\n별을 노래하는 마음으로\n모든 죽어 가는 것을 사랑해야지\n그리고 나한테 주어진 길을\n걸어가야겠다.\n\n오늘 밤에도 별이 바람에 스치운다.",
    questions: [
      {
        id: "mp2-q1",
        statement: "화자는 자기 성찰적 태도를 보이고 있다.",
        isTrue: true,
        explanation:
          "'한 점 부끄럼이 없기를' 바라는 모습에서 화자의 깊은 자기 성찰적 태도가 드러납니다.",
      },
      {
        id: "mp2-q2",
        statement: "'바람'은 화자에게 기쁨과 평화를 주는 존재이다.",
        isTrue: false,
        explanation:
          "'잎새에 이는 바람에도 나는 괴로워했다'에서 바람은 고뇌와 번민을 일으키는 외부적 자극을 상징합니다.",
      },
      {
        id: "mp2-q3",
        statement: "이 시는 일제 강점기 지식인의 내면적 갈등을 반영하고 있다.",
        isTrue: true,
        explanation:
          "윤동주는 일제 강점기의 지식인으로서, 순결한 양심을 지키며 살고자 하는 내면의 갈등과 결의를 표현하고 있습니다.",
      },
      {
        id: "mp2-q4",
        statement: "'모든 죽어 가는 것을 사랑해야지'에서 화자는 허무주의적 세계관을 드러내고 있다.",
        isTrue: false,
        explanation:
          "이 구절은 소멸해가는 것들에 대한 깊은 연민과 사랑을 표현합니다. 생명에 대한 경외와 공동체적 사랑의 의지입니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp2-1",
        sourceTitle: "2024학년도 수능",
        statement: "'별'과 '바람'은 각각 이상과 현실적 시련을 상징하는 대립적 소재이다.",
        isTrue: true,
        explanation:
          "'별'은 이상적 가치(순수, 양심)를, '바람'은 현실에서 겪는 시련을 상징합니다. 두 소재의 대립을 통해 화자의 내적 갈등이 형상화됩니다.",
      },
      {
        id: "re-mp2-2",
        sourceTitle: "2021학년도 6월 평가원",
        statement: "이 시의 화자는 현실에 안주하며 소극적 태도를 보이고 있다.",
        isTrue: false,
        explanation:
          "화자는 '걸어가야겠다'라는 의지적 표현을 통해 능동적이고 실천적인 자세를 보여줍니다.",
      },
    ],
  },
  {
    id: "modern-novel-1",
    grandUnit: "literature",
    categoryId: "modern-novel",
    title: "소나기",
    author: "황순원",
    source: "2024학년도 6월 모의평가",
    passage:
      "소년은 개울가에서 소녀를 보자 곧 윤 초시네 증손녀라는 걸 알 수 있었다. 소녀는 개울에다 손을 잠그고 물장난을 하고 있는 것이다. 서울서는 이런 개울물을 보지 못하기나 한 듯이.\n\n벌써 며칠째 소녀는 학교에서 돌아오는 길에 물장난이었다. 그런데, 어제까지 개울 기슭에서 하더니, 오늘은 징검다리 한가운데 앉아서 하고 있다.\n\n소년은 개울둑에 앉아 버들가지에 물을 튀기고 있었다.",
    questions: [
      {
        id: "mn1-q1",
        statement: "이 작품은 1인칭 주인공 시점으로 서술되고 있다.",
        isTrue: false,
        explanation:
          "이 작품은 3인칭 전지적 작가 시점으로 서술되고 있습니다. '소년은', '소녀는'과 같이 인물을 객관적으로 묘사하고 있습니다.",
      },
      {
        id: "mn1-q2",
        statement: "'개울'은 소년과 소녀를 연결하는 매개체 역할을 하고 있다.",
        isTrue: true,
        explanation:
          "개울은 두 인물이 만나는 공간이자, 순수한 교감이 이루어지는 매개체입니다.",
      },
      {
        id: "mn1-q3",
        statement: "소녀가 징검다리 한가운데로 자리를 옮긴 것은 소년에게 다가가려는 행동이다.",
        isTrue: true,
        explanation:
          "소녀가 개울 기슭에서 징검다리 한가운데로 옮긴 것은 소년에게 더 가까이 다가가려는 무의식적 행동으로 해석됩니다.",
      },
      {
        id: "mn1-q4",
        statement: "이 작품에서 자연 배경은 인물들의 순수한 감정을 부각하는 역할을 한다.",
        isTrue: true,
        explanation:
          "개울, 징검다리, 버들가지 등의 자연물은 소년과 소녀의 순수하고 맑은 감정을 부각시키는 배경으로 기능합니다.",
      },
    ],
  },
  {
    id: "classic-poetry-1",
    grandUnit: "literature",
    categoryId: "classic-poetry",
    title: "청산별곡",
    author: "작자 미상",
    source: "수능특강 문학 152p",
    originalText:
      "살어리 살어리랏다 청산에 살어리랏다\n멀위랑 다래랑 먹고 청산에 살어리랏다\n얄리얄리 얄랑셩 얄라리 얄라\n\n우러라 우러라 새여 자고 니러 우러라 새여\n널라와 시름 한 나도 자고 니러 우러노라\n얄리얄리 얄랑셩 얄라리 얄라",
    modernText:
      "살고 싶다 살고 싶다 청산에 살고 싶다\n머루랑 다래랑 먹고 청산에 살고 싶다\n얄리얄리 얄랑셩 얄라리 얄라\n\n울어라 울어라 새야 자고 일어나 울어라 새야\n너보다 시름이 많은 나도 자고 일어나 우노라\n얄리얄리 얄랑셩 얄라리 얄라",
    passage:
      "살어리 살어리랏다 청산에 살어리랏다\n멀위랑 다래랑 먹고 청산에 살어리랏다\n얄리얄리 얄랑셩 얄라리 얄라\n\n우러라 우러라 새여 자고 니러 우러라 새여\n널라와 시름 한 나도 자고 니러 우러노라\n얄리얄리 얄랑셩 얄라리 얄라",
    questions: [
      {
        id: "cp1-q1",
        statement: "이 작품은 고려 시대의 속요(고려가요)에 해당한다.",
        isTrue: true,
        explanation:
          "청산별곡은 고려 시대에 창작된 대표적인 속요(고려가요)로, 평민의 삶과 정서를 담고 있습니다.",
      },
      {
        id: "cp1-q2",
        statement: "'청산'은 현실 세계의 풍요로움을 상징한다.",
        isTrue: false,
        explanation:
          "'청산'은 현실의 고통에서 벗어나고자 하는 이상향 또는 도피처를 상징합니다.",
      },
      {
        id: "cp1-q3",
        statement: "'얄리얄리 얄랑셩'은 여음(후렴구)으로 리듬감을 부여한다.",
        isTrue: true,
        explanation:
          "이 구절은 매 연의 끝에 반복되는 여음(후렴구)으로, 노래의 리듬감을 살리고 정서적 흐름을 이어주는 역할을 합니다.",
      },
      {
        id: "cp1-q4",
        statement: "이 시의 화자는 현실에 만족하며 안정된 삶을 살고 있다.",
        isTrue: false,
        explanation:
          "화자는 현실에서의 시름과 고통을 견디지 못해 청산으로 가려는 모습을 보입니다.",
      },
    ],
  },
  {
    id: "classic-novel-1",
    grandUnit: "literature",
    categoryId: "classic-novel",
    title: "춘향전",
    author: "작자 미상",
    source: "수능완성 문학 89p",
    passage:
      "이 도령이 방자를 불러,\n\"저기 그네 뛰는 저 계집이 누구냐?\"\n\"예, 저것은 퇴기 월매의 딸이요, 이름은 춘향이라 하옵니다. 나이 열여섯에 자색이 절륜하고 문장과 가무에 능하오나, 기생의 딸이라 양반이 상대할 바 아니옵니다.\"\n\"그 말이 무슨 말이냐. 사람이 사람을 사랑하는 데 신분이 무슨 상관이냐.\"\n이 도령의 눈에는 그네를 뛰는 춘향의 모습이 선녀와 같았다.",
    questions: [
      {
        id: "cn1-q1",
        statement: "이 장면에서 이 도령은 신분의 차이를 중요하게 여기고 있다.",
        isTrue: false,
        explanation:
          "'사람이 사람을 사랑하는 데 신분이 무슨 상관이냐'라는 대사에서 신분 차이를 초월한 사랑을 강조하고 있습니다.",
      },
      {
        id: "cn1-q2",
        statement: "방자는 이 도령에게 춘향과의 만남을 적극 권유하고 있다.",
        isTrue: false,
        explanation:
          "방자는 '양반이 상대할 바 아니옵니다'라며 오히려 만남을 만류하는 태도를 보입니다.",
      },
      {
        id: "cn1-q3",
        statement: "춘향전은 조선 시대 판소리계 소설에 해당한다.",
        isTrue: true,
        explanation:
          "춘향전은 판소리 '춘향가'를 바탕으로 소설화된 판소리계 소설의 대표작입니다.",
      },
      {
        id: "cn1-q4",
        statement: "이 작품에서 '그네 뛰기' 장면은 계절적 배경으로 봄(단오)을 암시한다.",
        isTrue: true,
        explanation:
          "그네뛰기는 단오의 대표적인 민속놀이로, 봄날 단오의 계절적 배경을 암시합니다.",
      },
    ],
  },
];

export function getQuizzesByCategory(categoryId: string): QuizPassage[] {
  return quizPassages.filter((q) => q.categoryId === categoryId);
}

export function getQuizById(quizId: string): QuizPassage | undefined {
  return quizPassages.find((q) => q.id === quizId);
}
