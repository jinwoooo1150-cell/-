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

export type NarrativePhase =
  | "exposition"
  | "rising"
  | "climax"
  | "falling"
  | "resolution";

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
    categories: [
      "modern-poetry",
      "modern-novel",
      "classic-poetry",
      "classic-novel",
    ],
  },
  non_fiction: {
    id: "non_fiction" as GrandUnit,
    name: "독서",
    nameEn: "Non-fiction",
    categories: [],
  },
};

// ⚠️ 함수를 파일 상단에 정의하여 'is not a function' 오류 방지
export function getQuizzesByGrandUnit(grandUnit: GrandUnit): QuizPassage[] {
  return quizPassages.filter((q) => q.grandUnit === grandUnit);
}

export function getQuizzesByCategory(categoryId: string): QuizPassage[] {
  return quizPassages.filter((q) => q.categoryId === categoryId);
}
export function getQuizById(id: string): QuizPassage | undefined {
  return quizPassages.find((q) => q.id === id);
}

// 데이터 배열 시작
export const quizPassages: QuizPassage[] = [
  {
    id: "classic-novel-yucr-1",
    grandUnit: "literature",
    categoryId: "classic-novel",
    title: "유충렬전",
    author: "작자 미상",
    source: "수능특강 문학 112p",
    passage:
      '충렬이 나이 겨우 다섯 살이라. 어머니 장씨 부인이 아이를 안고 피란하다가 정한담의 군사에게 잡히니, 장씨 부인은 바위 아래로 몸을 던져 목숨을 끊으려 하거늘, 하늘이 이 충신의 자식을 버리지 아니하여 한 줄기 오색 구름이 내려와 아이를 감싸니, 군사들이 놀라 물러가더라.\n\n이때 한 노승이 지나다가 아이의 울음소리를 듣고 찾아와 안아 들고 탄식하여 왈,\n"이 아이는 장차 나라를 구할 재목이로다. 내 마땅히 데려가 기르리라."\n하고 아이를 업고 깊은 산중으로 들어가니라.',
    narrativePhase: "exposition",
    narrativeSections: [
      {
        phase: "exposition",
        title: "유충렬의 위기",
        summary: "어린 충렬이 역적 정한담의 난으로 가족을 잃고 노승에게 구출됨",
      },
      {
        phase: "rising",
        title: "성장과 수련",
        summary: "산중에서 무예와 학문을 연마하며 영웅으로 성장",
      },
      {
        phase: "climax",
        title: "전장의 영웅",
        summary: "조정의 위기에 출전하여 적장들을 차례로 격파",
      },
      {
        phase: "falling",
        title: "정한담 토벌",
        summary: "역적 정한담을 정벌하고 부모의 원수를 갚음",
      },
      {
        phase: "resolution",
        title: "충효의 완성",
        summary: "공을 인정받아 벼슬에 오르고 부모와 재회",
      },
    ],
    characterMap: {
      characters: [
        {
          name: "유충렬",
          role: "주인공",
          description: "충신 유심의 아들, 영웅적 장수",
        },
        {
          name: "유심",
          role: "아버지",
          description: "충신, 정한담의 모함으로 유배",
        },
        {
          name: "장씨 부인",
          role: "어머니",
          description: "충렬의 어머니, 절개를 지킴",
        },
        {
          name: "정한담",
          role: "적대자",
          description: "간신, 나라를 어지럽히는 역적",
        },
        {
          name: "노승",
          role: "조력자",
          description: "충렬을 구하고 무예를 가르침",
        },
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
        statement:
          "'오색 구름'은 하늘이 유충렬을 보호하는 초월적 존재임을 나타낸다.",
        isTrue: true,
        explanation:
          "오색 구름은 천상적 존재의 개입을 상징하며, 유충렬이 하늘의 보호를 받는 비범한 인물임을 보여줍니다. 이는 영웅소설의 전형적인 '천우신조(天佑神助)' 모티프입니다.",
      },
      {
        id: "cn-yucr1-q2",
        statement:
          "장씨 부인이 바위 아래로 몸을 던지려 한 것은 비겁한 도주의 행위이다.",
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
        statement:
          "이 장면은 시간의 흐름에 따라 사건이 순차적으로 전개되고 있다.",
        isTrue: true,
        explanation:
          "피란 → 포위 → 장씨 부인의 결심 → 오색 구름의 구원 → 노승의 등장 순으로 시간 순서에 따라 사건이 전개되며, 이는 고전소설의 전형적인 순행적 구조입니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-yucr1-1",
        sourceTitle: "2024학년도 수능",
        statement:
          "고전 영웅소설에서 주인공의 고난은 후일 영웅적 활약의 서사적 필연성을 갖는다.",
        isTrue: true,
        explanation:
          "영웅소설의 주인공이 어린 시절 겪는 고난(가족 이산, 생명 위협)은 이후 영웅으로 성장하여 원수를 갚고 나라를 구하는 서사의 필연적 전제가 됩니다. '고난 → 성장 → 활약'의 구조입니다.",
      },
      {
        id: "re-yucr1-2",
        sourceTitle: "2023학년도 6월 평가원",
        statement:
          "이 작품의 서술자는 전지적 시점에서 인물의 내면까지 서술하고 있다.",
        isTrue: false,
        explanation:
          "이 장면에서 서술자는 인물의 행동과 외적 상황을 서술할 뿐, 내면 심리를 직접 서술하지 않습니다. '목숨을 끊으려 하거늘'은 행동 묘사이지 내면 서술이 아닙니다.",
      },
    ],
  },
  {
    id: "modern-poem-1",
    grandUnit: "literature",
    categoryId: "modern-poetry",
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
        statement:
          "이 시에서 화자는 자신의 감정을 행동으로 간접 전달하고 있다.",
        isTrue: true,
        explanation:
          "'고이 보내 드리우리다', '가실 길에 뿌리우리다' 등 구체적인 행동 묘사를 통해 감정을 간접적으로 전달하고 있습니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp1-1",
        sourceTitle: "2023학년도 수능",
        statement:
          "화자가 꽃을 뿌리는 행위는 이별의 슬픔을 의식적으로 억제하려는 태도를 보여준다.",
        isTrue: true,
        explanation:
          "화자는 이별의 고통을 겉으로 드러내지 않고, 꽃을 뿌리는 행위를 통해 아름다운 이별을 연출하면서 슬픔을 내면화하고 있습니다.",
      },
      {
        id: "re-mp1-2",
        sourceTitle: "2022학년도 9월 평가원",
        statement:
          "'사뿐히 즈려밟고'는 화자가 임에게 고통을 주고 싶은 마음을 표현한 것이다.",
        isTrue: false,
        explanation:
          "이는 임에게 고통을 주려는 것이 아니라, 임의 발걸음을 편안하게 해주려는 자기희생적 사랑의 역설적 표현입니다.",
      },
    ],
  },
  {
    id: "modern-poem-gil",
    grandUnit: "literature",
    categoryId: "modern-poetry",
    title: "길",
    author: "김소월",
    source: "2027학년도 EBS 수능특강 문학 008~009쪽",
    passage:
      "어제도 하룻밤\n나그네 집에\n가마귀 가와가와 울며 새었소.\n\n오늘은\n또 몇 십 리\n어디로 갈까.\n\n산으로 올라갈까\n들로 갈까\n오라는 곳이 없어 나는 못 가오.\n\n말 마소 내 집도\n정주(定州) 곽산(郭山)\n차(車) 가고 배 가는 곳이라오.\n\n여보소 공중에\n저 기러기\n공중엔 길 있어서 잘 가는가?\n\n여보소 공중에\n저 기러기\n열 십자(十字) 복판에 내가 섰소.\n\n갈래갈래 갈린 길\n길이라도\n내게 바이 갈 길은 하나 없소.",
    questions: [
      {
        id: "mp-gil-q1",
        statement:
          "이 시는 '-오', '-소' 등의 종결 어미를 반복하여 운율을 형성하고 있다.",
        isTrue: true,
        explanation:
          "각 연의 종결 어미를 '-오', '-소' 등으로 반복하여 사용하여 규칙적인 리듬감(각운)을 형성하고 있습니다.",
      },
      {
        id: "mp-gil-q2",
        statement:
          "이 시는 의문형 종결 방식을 통해 시 전체의 율격 통일성을 완벽하게 맞추고 있다.",
        isTrue: false,
        explanation:
          "'공중엔 길 있어서 잘 가는가?'와 같은 의문형 종결은 화자의 정서(부러움, 한탄)를 부각하기 위한 것이지, 율격의 통일성을 위한 장치는 아닙니다.",
      },
      {
        id: "mp-gil-q3",
        statement: "이 시에서 '기러기'와 화자는 처지가 대조되는 대상이다.",
        isTrue: true,
        explanation:
          "공중에 길이 있어 자유롭게 날아가는 '기러기'와, 갈림길(열 십자 복판)에 서서 갈 곳 몰라 하는 '화자'의 처지는 서로 대조(대비)됩니다.",
      },
      {
        id: "mp-gil-q4",
        statement:
          "화자는 관념 속에서 종교적 진리를 구하기 위해 방황하고 있다.",
        isTrue: false,
        explanation:
          "이 시의 화자는 일제 강점기라는 현실적 고난 속에서 삶의 터전을 잃고 떠도는 유랑민입니다. 종교적 진리 탐구와는 거리가 멉니다.",
      },
      {
        id: "mp-gil-q5",
        statement:
          "'정주 곽산'은 화자가 가고 싶어도 갈 수 없는 고향을 의미한다.",
        isTrue: true,
        explanation:
          "'차 가고 배 가는 곳'이라며 구체적인 지명을 언급하지만, '내 집'인 고향에 갈 수 없는 화자의 안타까운 처지를 부각하고 있습니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp-gil-1",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'기러기'는 화자와 동일한 처지에 놓인 대상으로, 화자의 슬픔을 심화하는 객관적 상관물이다.",
        isTrue: false,
        explanation:
          "기러기는 공중에 길이 있어 자유롭게 날아가는 존재로, 갈림길에 서서 갈 곳 몰라 하는 화자의 처지와 '대조'되는 대상입니다. (동일한 처지 X)",
      },
      {
        id: "re-mp-gil-2",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'열 십자(十字) 복판'은 화자가 나아가야 할 삶의 방향을 깨닫게 되는 희망적 공간이다.",
        isTrue: false,
        explanation:
          "열 십자 복판은 갈래갈래 갈린 길의 한가운데로, 어디로 가야 할지 몰라 방황하는 화자의 '방향 상실'과 '절망'을 보여주는 공간입니다.",
      },
      {
        id: "re-mp-gil-3",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'정주 곽산'은 화자가 현재 가고 있는 목적지이며, 곧 도착할 수 있다는 확신을 보여준다.",
        isTrue: false,
        explanation:
          "정주 곽산은 화자의 집이 있는 곳이지만, '차 가고 배 가는 곳'이라며 자신은 갈 수 없는 처지임을 부각하고 있습니다. 목적지가 아닌 상실한 고향을 의미합니다.",
      },
      {
        id: "re-mp-gil-4",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "화자는 관념적인 세계 속에서 인생의 진리를 탐구하거나 종교적 구원을 갈망하고 있다.",
        isTrue: false,
        explanation:
          "이 시는 삶의 터전을 잃고 유랑하는 민족의 비애를 다룬 작품으로, 화자가 관념 속에서 진리를 찾거나 종교적 구원을 바라는 태도는 나타나지 않습니다.",
      },
      {
        id: "re-mp-gil-5",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'가마귀'가 울며 새는 청각적 이미지는 화자의 암울하고 비극적인 정서를 고조시킨다.",
        isTrue: true,
        explanation:
          "가마귀의 울음소리는 나그네의 고단한 여정과 어우러져 시 전체의 애상적이고 비극적인 분위기를 형성하는 소재입니다.",
      },
      {
        id: "re-mp-gil-6",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'오늘'과 '내일'의 시간적 대비를 통해 화자의 상황이 개선될 것임을 암시한다.",
        isTrue: false,
        explanation:
          "이 시에는 '어제도 하룻밤', '오늘은 또 몇 십 리'라는 표현을 통해 정처 없는 유랑의 시간이 반복되고 있음을 보여줄 뿐, 상황 개선의 암시는 드러나지 않습니다.",
      },
    ],
  },
];
