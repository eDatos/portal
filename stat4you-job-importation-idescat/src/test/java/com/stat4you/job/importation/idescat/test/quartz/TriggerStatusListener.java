package com.stat4you.job.importation.idescat.test.quartz;

import java.util.Date;
import java.util.Map;

import net.sf.ehcache.store.chm.ConcurrentHashMap;

import org.quartz.JobExecutionContext;
import org.quartz.Trigger;
import org.quartz.Trigger.CompletedExecutionInstruction;
import org.quartz.TriggerKey;
import org.quartz.TriggerListener;

public class TriggerStatusListener implements TriggerListener {
    
    private Map<TriggerKey, TriggerStatus> status = new ConcurrentHashMap<TriggerKey, TriggerStatus>();

    @Override
    public String getName() {
        return "CountTriggerListener";
    }

    @Override
    public void triggerFired(Trigger trigger, JobExecutionContext context) {
        getTriggerStatus(trigger.getKey()).setFireDate(new Date());

    }

    @Override
    public boolean vetoJobExecution(Trigger trigger, JobExecutionContext context) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void triggerMisfired(Trigger trigger) {

    }

    @Override
    public void triggerComplete(Trigger trigger, JobExecutionContext context, CompletedExecutionInstruction triggerInstructionCode) {
        getTriggerStatus(trigger.getKey()).setCompleteDate(new Date());
    }
    
    
    public Map<TriggerKey, TriggerStatus> getStatus() {
        return status;
    }
    
    private TriggerStatus getTriggerStatus(TriggerKey key) {
        TriggerStatus triggerStatus = status.get(key);
        if (triggerStatus == null) {
            triggerStatus = new TriggerStatus(key);
            status.put(key, triggerStatus);
        }
        return triggerStatus;
    }

    public static class TriggerStatus {

        private TriggerKey key          = null;
        private Date       fireDate     = null;
        private Date       completeDate = null;
        
        
        public TriggerStatus(TriggerKey key) {
            this.key = key;
        }

        public TriggerKey getKey() {
            return key;
        }

        public void setKey(TriggerKey key) {
            this.key = key;
        }

        public Date getFireDate() {
            return fireDate;
        }

        public void setFireDate(Date fireDate) {
            this.fireDate = fireDate;
        }

        public Date getCompleteDate() {
            return completeDate;
        }

        public void setCompleteDate(Date completeDate) {
            this.completeDate = completeDate;
        }
    }
}
