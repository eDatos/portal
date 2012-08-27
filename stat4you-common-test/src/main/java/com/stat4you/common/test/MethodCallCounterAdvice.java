package com.stat4you.common.test;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.springframework.aop.MethodBeforeAdvice;


public class MethodCallCounterAdvice implements MethodBeforeAdvice {
    
    private Map<String, Integer> counter = new HashMap<String, Integer>();
   
    @Override
    public void before(Method method, Object[] args, Object target) throws Throwable {
        String className = method.getDeclaringClass().getName();
        String methodName = method.getName();
        registerMethodCall(className, methodName);
    }

    private String getCounterMapKey(String clazz, String method){
        return clazz + "#" + method;
    }
    
    private void registerMethodCall(String clazz, String method){
       String mapKey = getCounterMapKey(clazz, method);
       Integer actualCount = getMethodCallCounts(mapKey);
       counter.put(mapKey, actualCount + 1); 
    }
    
    private Integer getMethodCallCounts(String mapKey){
        Integer count = 0;
        if(counter.containsKey(mapKey)){
            count = counter.get(mapKey);
        }
        return count;        
    }
        public int getMethodCallCounts(String clazz, String method){
        String mapKey = getCounterMapKey(clazz, method);
        return getMethodCallCounts(mapKey);
    }


}
