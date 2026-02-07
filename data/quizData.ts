export interface QuizQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface QuizPassage {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  source: string;
  passage: string;
  questions: QuizQuestion[];
}

export const quizPassages: QuizPassage[] = [
  {
    id: "modern-poem-1",
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
          "화자는 겉으로는 체념한 듯 보이지만, '죽어도 아니 눈물 흘리우리다'라는 역설적 표현을 통해 이별의 슬픔을 극대화하고 있습니다. 이는 체념이 아닌 강한 미련과 사랑의 표현입니다.",
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
          "진달래꽃은 화자의 사랑과 헌신을 상징하는 소재입니다. 떠나는 임의 길에 꽃을 뿌린다는 것은 아름다운 이별을 연출하면서도 슬픔을 내면화하는 행위입니다.",
      },
      {
        id: "mp1-q4",
        statement: "이 시에서 화자는 자신의 감정을 직접적으로 드러내지 않고 행동으로 보여주고 있다.",
        isTrue: true,
        explanation:
          "'고이 보내 드리우리다', '가실 길에 뿌리우리다' 등 구체적인 행동 묘사를 통해 감정을 간접적으로 전달하는 기법을 사용하고 있습니다.",
      },
    ],
  },
  {
    id: "modern-poem-2",
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
          "'한 점 부끄럼이 없기를' 바라는 모습에서 화자의 깊은 자기 성찰적 태도가 드러납니다. 양심에 부끄럽지 않은 삶을 추구하는 의지가 나타납니다.",
      },
      {
        id: "mp2-q2",
        statement: "'바람'은 화자에게 기쁨과 평화를 주는 존재이다.",
        isTrue: false,
        explanation:
          "'잎새에 이는 바람에도 나는 괴로워했다'에서 볼 수 있듯이, 바람은 화자에게 고뇌와 번민을 일으키는 외부적 자극을 상징합니다.",
      },
      {
        id: "mp2-q3",
        statement: "이 시는 일제 강점기 지식인의 내면적 갈등을 반영하고 있다.",
        isTrue: true,
        explanation:
          "윤동주는 일제 강점기의 지식인으로서, 순결한 양심을 지키며 살고자 하는 내면의 갈등과 결의를 이 시를 통해 표현하고 있습니다.",
      },
      {
        id: "mp2-q4",
        statement: "'모든 죽어 가는 것을 사랑해야지'에서 화자는 허무주의적 세계관을 드러내고 있다.",
        isTrue: false,
        explanation:
          "이 구절은 허무주의가 아닌, 소멸해가는 것들에 대한 깊은 연민과 사랑을 표현합니다. 생명에 대한 경외와 공동체적 사랑의 의지가 담겨 있습니다.",
      },
      {
        id: "mp2-q5",
        statement: "마지막 행 '별이 바람에 스치운다'는 시상의 전환 없이 여운을 남기는 역할을 한다.",
        isTrue: true,
        explanation:
          "마지막 행은 결의를 다진 후 다시 현실의 고뇌로 돌아오는 순환적 구조를 만들어, 시 전체에 여운과 깊이를 부여합니다.",
      },
    ],
  },
  {
    id: "modern-novel-1",
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
          "개울은 두 인물이 만나는 공간이자, 순수한 교감이 이루어지는 매개체입니다. 소녀의 물장난과 소년의 관찰이 이 공간에서 이루어집니다.",
      },
      {
        id: "mn1-q3",
        statement: "소녀가 '징검다리 한가운데'로 자리를 옮긴 것은 의미 없는 행동이다.",
        isTrue: false,
        explanation:
          "소녀가 개울 기슭에서 징검다리 한가운데로 자리를 옮긴 것은 소년에게 더 가까이 다가가려는 무의식적 행동으로 해석됩니다. 이는 두 인물 사이의 심리적 거리가 좁아지고 있음을 암시합니다.",
      },
      {
        id: "mn1-q4",
        statement: "이 작품에서 자연 배경은 인물들의 순수한 감정을 부각하는 역할을 한다.",
        isTrue: true,
        explanation:
          "개울, 징검다리, 버들가지 등의 자연물은 소년과 소녀의 순수하고 맑은 감정을 효과적으로 부각시키는 배경으로 기능합니다.",
      },
    ],
  },
  {
    id: "classic-poetry-1",
    categoryId: "classic-poetry",
    title: "청산별곡",
    author: "작자 미상",
    source: "수능특강 문학 152p",
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
          "'청산'은 현실의 고통에서 벗어나고자 하는 이상향 또는 도피처를 상징합니다. 화자가 현실의 시름을 피해 가고자 하는 공간입니다.",
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
          "화자는 현실에서의 시름과 고통을 견디지 못해 청산으로 가려는 모습을 보입니다. '시름 한 나도'에서 화자의 깊은 고뇌가 드러납니다.",
      },
    ],
  },
  {
    id: "classic-novel-1",
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
          "'사람이 사람을 사랑하는 데 신분이 무슨 상관이냐'라는 대사에서 이 도령이 신분의 차이를 초월한 사랑의 가치를 강조하고 있음을 알 수 있습니다.",
      },
      {
        id: "cn1-q2",
        statement: "방자는 이 도령에게 춘향과의 만남을 적극 권유하고 있다.",
        isTrue: false,
        explanation:
          "방자는 '기생의 딸이라 양반이 상대할 바 아니옵니다'라며 오히려 만남을 만류하는 태도를 보이고 있습니다. 신분 질서를 의식한 발언입니다.",
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
          "그네뛰기는 단오(음력 5월 5일)의 대표적인 민속놀이로, 이 장면은 봄날 단오의 계절적 배경을 암시하고 있습니다.",
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
