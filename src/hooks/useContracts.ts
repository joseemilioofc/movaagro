import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Contract {
  id: string;
  contract_number: string;
  transport_request_id: string;
  proposal_id: string;
  cooperative_id: string;
  transporter_id: string;
  terms: string;
  price: number;
  pickup_date: string;
  origin_address: string;
  destination_address: string;
  cargo_type: string;
  weight_kg: number | null;
  cooperative_signature: string | null;
  cooperative_signed_at: string | null;
  transporter_signature: string | null;
  transporter_signed_at: string | null;
  status: string;
  created_at: string;
}

interface CreateContractParams {
  transportRequestId: string;
  proposalId: string;
  cooperativeId: string;
  transporterId: string;
  price: number;
  pickupDate: string;
  originAddress: string;
  destinationAddress: string;
  cargoType: string;
  weightKg?: number | null;
}

export const useContracts = (transportRequestId?: string) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MOVA-${year}-${random}`;
  };

  const generateTerms = (params: CreateContractParams) => {
    const NI = "Não informado";
    const money = params.price.toLocaleString("pt-MZ", { style: "currency", currency: "MZN" });
    const pickup = new Date(params.pickupDate).toLocaleDateString("pt-MZ");

    return `CONTRATO ELECTRÓNICO DE INTERMEDIAÇÃO E PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE DE CARGA AGRÍCOLA

Este contrato é celebrado através da plataforma tecnológica MOVA AGRO, que actua exclusivamente como intermediária tecnológica entre as partes. A MOVA AGRO NÃO é transportadora, operadora logística, seguradora, proprietária da carga, proprietária do veículo, empregadora do motorista nem representante das partes.

1. IDENTIFICAÇÃO DAS PARTES
1.1. PLATAFORMA INTERMEDIÁRIA: MOVA AGRO, LDA, com sede na Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Avenida Eduardo Mondlane, Moçambique, e-mail movaagro@gmail.com, adiante designada "MOVA AGRO" ou "Plataforma".
1.2. CONTRATANTE (Expedidor/Cooperativa): identificado no cabeçalho deste contrato e no registo electrónico da viagem, incluindo nome, NUIT, contacto telefónico e responsável no local de carga.
1.3. TRANSPORTADOR (Contratado): pessoa singular ou colectiva identificada no registo electrónico, incluindo nome, NUIT, motorista designado, contacto, carta de condução, matrícula do veículo e do reboque, quando aplicável.
1.4. As partes declaram que os dados constantes do registo electrónico da viagem são verdadeiros e integram este contrato para todos os efeitos.

2. OBJECTO
2.1. O presente contrato tem por objecto a prestação de serviços de transporte rodoviário de carga agrícola pelo TRANSPORTADOR ao CONTRATANTE, nas condições aqui descritas.
2.2. A MOVA AGRO limita-se a disponibilizar a infra-estrutura tecnológica que permite a aproximação das partes, a formalização electrónica do acordo e o acompanhamento da viagem.
2.3. A relação de transporte estabelece-se directa e exclusivamente entre CONTRATANTE e TRANSPORTADOR, não sendo a MOVA AGRO parte na execução do transporte.

3. DESCRIÇÃO DA CARGA
Tipo de carga: ${params.cargoType}
Categoria: ${params.cargoType}
Quantidade: ${NI}
Peso estimado: ${params.weightKg ? `${params.weightKg} kg` : NI}
Volume: ${NI}
Valor declarado da carga: ${NI}
Observações: ${NI}
3.1. A exactidão da descrição da carga é da inteira responsabilidade do CONTRATANTE.

4. ORIGEM
Endereço de recolha: ${params.originAddress}
Responsável no local: ${NI}
Contacto: ${NI}

5. DESTINO
Endereço de entrega: ${params.destinationAddress}
Responsável no local: ${NI}
Contacto: ${NI}

6. DATAS
Data prevista de recolha: ${pickup}
Hora prevista de recolha: ${NI}
Data prevista de entrega: ${NI}
6.1. Alterações de datas devem ser registadas na plataforma e acordadas entre as partes.

7. VALOR DO TRANSPORTE
7.1. O valor acordado pelo serviço é de ${money}.
7.2. Forma de pagamento: conforme acordado entre as partes e registado na plataforma.
7.3. O pagamento é devido pelo CONTRATANTE ao TRANSPORTADOR. A MOVA AGRO não é parte na relação financeira e não garante o pagamento nem o recebimento de valores entre as partes.

8. RASTREAMENTO DA VIAGEM
8.1. A viagem poderá ser acompanhada através das funcionalidades de geolocalização da plataforma, mediante consentimento do condutor.
8.2. Os registos de localização têm natureza meramente informativa e não constituem garantia de cumprimento de prazos.
8.3. A indisponibilidade temporária do rastreamento não isenta o TRANSPORTADOR das suas obrigações.

9. DOCUMENTOS ANEXADOS
9.1. Integram este contrato, quando disponíveis: alvará do transportador, livrete e matrícula do veículo, inspecção, seguro, carta de condução do motorista, guia de remessa e comprovativos de recolha e entrega.
9.2. Os documentos são carregados e mantidos pelas próprias partes, cabendo-lhes garantir a sua validade e autenticidade.

10. OBRIGAÇÕES DO CONTRATANTE
a) Disponibilizar a carga no local, data e hora acordados;
b) Prestar informação verdadeira e completa sobre a carga;
c) Assegurar o acondicionamento adequado e a documentação legal da mercadoria;
d) Garantir condições de acesso e de carregamento no local de origem;
e) Efectuar o pagamento nos termos acordados.

11. OBRIGAÇÕES DO TRANSPORTADOR
a) Executar o transporte com diligência, segurança e cumprimento da legislação aplicável;
b) Manter o veículo em boas condições e com toda a documentação válida;
c) Utilizar condutor legalmente habilitado;
d) Comunicar de imediato qualquer incidente, avaria, desvio ou atraso;
e) Entregar a carga ao destinatário indicado, obtendo comprovativo de entrega;
f) Manter, quando aplicável, seguro de responsabilidade civil e de mercadorias transportadas.

12. RECEBIMENTO DA CARGA
12.1. No momento da recolha, o TRANSPORTADOR deve conferir a carga quanto a quantidade, aparência e acondicionamento.
12.2. Divergências devem ser registadas na plataforma no acto da recolha; a ausência de registo presume conformidade aparente.

13. ENTREGA
13.1. A entrega considera-se concluída com a recepção da carga pelo destinatário e o respectivo registo na plataforma.
13.2. Reservas ou reclamações sobre o estado da carga devem ser apresentadas no acto da entrega ou, quando não aparentes, no prazo legalmente admissível.

14. RESPONSABILIDADE
14.1. A responsabilidade pela execução do transporte, pela guarda e integridade da carga e pelo cumprimento das obrigações legais e laborais é exclusiva do TRANSPORTADOR.
14.2. A MOVA AGRO não responde por perdas, avarias, atrasos, furtos, acidentes, incumprimentos contratuais, danos a terceiros ou quaisquer prejuízos decorrentes da execução do transporte.
14.3. Reitera-se que a MOVA AGRO não é transportadora, operadora logística, seguradora, proprietária da carga, proprietária do veículo, empregadora do motorista nem representante das partes, actuando unicamente como plataforma tecnológica de intermediação.
14.4. Casos de força maior devidamente comprovados excluem a responsabilidade da parte afectada, nos termos da lei.

15. CANCELAMENTO
15.1. Qualquer das partes pode cancelar o serviço antes do início da recolha, mediante comunicação registada na plataforma.
15.2. Cancelamentos após o início da execução podem gerar custos, a acordar directamente entre as partes.
15.3. A MOVA AGRO não arbitra nem suporta custos decorrentes de cancelamentos.

16. RESOLUÇÃO DE CONFLITOS
16.1. As partes obrigam-se a procurar, em primeiro lugar, a resolução amigável de qualquer divergência.
16.2. Não havendo acordo, o litígio será dirimido nos tribunais competentes da República de Moçambique, aplicando-se a lei moçambicana.
16.3. A eventual disponibilização de registos pela MOVA AGRO tem carácter meramente probatório e não a torna parte no litígio.

17. PROTECÇÃO DE DADOS
17.1. Os dados pessoais tratados no âmbito deste contrato são utilizados exclusivamente para a formalização e execução do serviço, nos termos da Política de Privacidade da MOVA AGRO.
17.2. As partes comprometem-se a não utilizar os dados obtidos através da plataforma para finalidades distintas das aqui previstas.
17.3. Os titulares dos dados podem exercer os seus direitos através do e-mail movaagro@gmail.com.

18. ACEITAÇÃO ELECTRÓNICA
18.1. As partes reconhecem a validade da contratação electrónica e da assinatura electrónica aposta neste documento.
18.2. O registo electrónico, incluindo data, hora, identificação do utilizador e código de verificação (hash) do documento, constitui meio de prova da aceitação.
18.3. A aceitação electrónica confirma que as partes leram e compreenderam que a MOVA AGRO actua apenas como intermediária tecnológica.

19. ASSINATURAS
19.1. Este contrato é assinado electronicamente pelo CONTRATANTE e pelo TRANSPORTADOR.
19.2. A MOVA AGRO figura como plataforma interveniente, exclusivamente para efeitos de registo e certificação electrónica do acordo, sem assumir obrigações de transporte.`;
  };


  const fetchContracts = async () => {
    try {
      let query = supabase
        .from("digital_contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (transportRequestId) {
        query = query.eq("transport_request_id", transportRequestId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContracts((data as Contract[]) || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (params: CreateContractParams): Promise<Contract | null> => {
    try {
      const contractData = {
        transport_request_id: params.transportRequestId,
        proposal_id: params.proposalId,
        cooperative_id: params.cooperativeId,
        transporter_id: params.transporterId,
        contract_number: generateContractNumber(),
        terms: generateTerms(params),
        price: params.price,
        pickup_date: params.pickupDate,
        origin_address: params.originAddress,
        destination_address: params.destinationAddress,
        cargo_type: params.cargoType,
        weight_kg: params.weightKg || null,
        status: "pending",
      };

      const { data, error } = await supabase
        .from("digital_contracts")
        .insert(contractData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Contrato criado!",
        description: "O contrato digital foi gerado e está aguardando assinaturas.",
      });

      fetchContracts();
      return data as Contract;
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        title: "Erro ao criar contrato",
        description: "Não foi possível gerar o contrato digital.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [transportRequestId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("contracts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "digital_contracts",
        },
        () => {
          fetchContracts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transportRequestId]);

  return {
    contracts,
    loading,
    createContract,
    refetch: fetchContracts,
  };
};
