import { createClient } from
    "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://kfbeppuwearblwvtcmqz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_CgofhoofpFdFeyhWFcb8sg_EkIoYn29";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);