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
    return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE DE CARGA

1. OBJETO DO CONTRATO
O presente contrato tem por objeto a prestação de serviços de transporte de carga agrícola, conforme especificações abaixo.

2. DESCRIÇÃO DA CARGA
Tipo: ${params.cargoType}
${params.weightKg ? `Peso estimado: ${params.weightKg} kg` : ""}

3. TRAJETO
Origem: ${params.originAddress}
Destino: ${params.destinationAddress}

4. DATA DE COLETA
${new Date(params.pickupDate).toLocaleDateString("pt-MZ")}

5. VALOR E PAGAMENTO
O valor total do serviço é de ${params.price.toLocaleString("pt-MZ", { style: "currency", currency: "MZN" })}, a ser pago conforme acordado entre as partes através da plataforma MOVA.

6. OBRIGAÇÕES DO CONTRATANTE
a) Disponibilizar a carga no local e data acordados;
b) Fornecer documentação necessária para o transporte;
c) Efetuar o pagamento conforme acordado.

7. OBRIGAÇÕES DO CONTRATADO
a) Realizar o transporte com segurança e cuidado;
b) Entregar a carga no destino acordado;
c) Comunicar qualquer imprevisto durante o transporte;
d) Manter veículo em boas condições de funcionamento.

8. RESPONSABILIDADES
O CONTRATADO será responsável pela integridade da carga durante o transporte, exceto em casos de força maior devidamente comprovados.

9. DISPOSIÇÕES GERAIS
Este contrato é regido pelas leis da República de Moçambique. Qualquer disputa será resolvida preferencialmente por acordo amigável entre as partes.

10. FORO
Fica eleito o foro da comarca do local de origem da carga para dirimir quaisquer dúvidas oriundas deste contrato.`;
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
