import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileCheck2, Loader2, Upload, X } from "lucide-react";

interface Props {
  label: string;
  bucket: string;
  pathPrefix: string;
  value: string | null;
  onChange: (path: string | null) => void;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}

export const FileUploadField = ({
  label, bucket, pathPrefix, value, onChange,
  accept = "image/*,application/pdf", required, disabled, hint,
}: Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Ficheiro muito grande", description: "Máximo 10 MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${pathPrefix}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;
      onChange(path);
      toast({ title: "Ficheiro enviado" });
    } catch (err: any) {
      toast({ title: "Erro no upload", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const openExisting = async () => {
    if (!value) return;
    const { data } = await supabase.storage.from(bucket).createSignedUrl(value, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-1">
      <Label className="text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {value ? (
        <div className="flex items-center gap-2 text-xs p-2 rounded-md border bg-muted/30">
          <FileCheck2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="flex-1 truncate">Ficheiro enviado</span>
          <Button type="button" size="sm" variant="ghost" onClick={openExisting}>Ver</Button>
          {!disabled && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept={accept}
            disabled={disabled || uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
      )}
      {hint && <p className="text-xs text-muted-foreground flex items-start gap-1"><Upload className="w-3 h-3 mt-0.5" />{hint}</p>}
    </div>
  );
};
