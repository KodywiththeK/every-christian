import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const faqs = [
    {
      question: "기독교에서 말하는 삼위일체란 무엇인가요?",
      answer:
        "삼위일체는 기독교의 핵심 교리로, 하나님은 성부, 성자, 성령의 세 위격으로 존재하지만 본질적으로는 한 분이라는 가르침입니다. 각 위격은 서로 구별되지만 동등하며, 함께 일하십니다.",
    },
    {
      question: "기도는 어떻게 하나요?",
      answer:
        "기도는 하나님과의 대화입니다. 특별한 형식이 필요하지 않으며, 진심으로 하나님께 말씀드리는 것이 중요합니다. 감사, 찬양, 고백, 간구 등 다양한 방식으로 기도할 수 있습니다. 예수님께서는 제자들에게 '주기도문'을 가르쳐 주셨습니다.",
    },
    {
      question: "성경은 어떻게 읽어야 하나요?",
      answer:
        "성경은 구약 39권, 신약 27권으로 구성되어 있습니다. 처음 읽는다면 신약의 복음서(마태, 마가, 누가, 요한복음)부터 시작하는 것이 좋습니다. 정기적으로 조금씩 읽고 묵상하며, 이해가 어려운 부분은 목회자나 성경 주석을 참고하세요.",
    },
    {
      question: "교회는 꼭 다녀야 하나요?",
      answer:
        "교회는 믿음의 공동체로, 함께 예배하고 성장하는 장소입니다. 히브리서 10:25에서는 '모이기를 폐하는 어떤 사람들의 습관과 같이 하지 말고 오직 권하여 그 날이 가까움을 볼수록 더욱 그리하자'라고 말씀합니다. 교회 공동체를 통해 서로 격려하고 믿음 안에서 성장할 수 있습니다.",
    },
    {
      question: "기독교인으로서 어떻게 살아야 하나요?",
      answer:
        "예수님의 가르침을 따라 하나님을 사랑하고 이웃을 내 몸과 같이 사랑하는 삶을 살아야 합니다. 성경 말씀을 통해 하나님의 뜻을 알아가고, 성령의 인도하심에 따라 살며, 예수님의 사랑을 실천하는 삶이 중요합니다.",
    },
  ]

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">기독교에 대해 자주 묻는 질문들을 모았습니다</p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium text-gray-800">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

