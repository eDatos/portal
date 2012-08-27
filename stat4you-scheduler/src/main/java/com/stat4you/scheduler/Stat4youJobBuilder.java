package com.stat4you.scheduler;

import java.util.UUID;

public class Stat4youJobBuilder {

    public static final String DEFAULT_GROUP = "DEFAULT";

    private String             name          = null;
    private String             group         = null;
    private Class<?>           jobClass      = null;

    /**
     * Produce the <code>Stat4youJob</code> instance defined by this <code>Stat4youJobBuilder</code>.
     * 
     * @return the defined Stat4youJob.
     */
    public Stat4youJob build() {

        Stat4youJob job = new Stat4youJob();

        job.setJobClass(jobClass);
        if (name == null) {
            name = Stat4youJobBuilder.createUniqueName(null);
        }
        if (group == null) {
            group = DEFAULT_GROUP;
        }

        job.setName(name);
        job.setGroup(group);
        return job;
    }
    /**
     * Create a JobBuilder with which to define a <code>Stat4youJob</code>.
     * 
     * @return a new JobBuilder
     */
    public static Stat4youJobBuilder newJob() {
        return new Stat4youJobBuilder();
    }

    /**
     * Create a JobBuilder with which to define a <code>Stat4youJob</code>,
     * and set the class name of the <code>Job</code> to be executed.
     * 
     * @return a new JobBuilder
     */
    public static Stat4youJobBuilder newJob(Class<?> jobClass) {
        Stat4youJobBuilder b = new Stat4youJobBuilder();
        b.ofType(jobClass);
        return b;
    }

    /**
     * Set the class which will be instantiated and executed when a
     * Trigger fires that is associated with this Stat4youJob.
     * 
     * @param jobClazz a class implementing the Job.
     * @return the updated Stat4youJobBuilder
     */
    public Stat4youJobBuilder ofType(Class<?> jobClazz) {
        this.jobClass = jobClazz;
        return this;
    }

    /**
     * Use a name and default group to dentify the Stat4youJob.
     * <p>
     * If none of the 'withIdentity' methods are set on the JobBuilder, then a random, unique JobKey will be generated.
     * </p>
     * 
     * @param name the name element for the Job's JobKey
     * @return the updated Stat4youJobBuilder
     */
    public Stat4youJobBuilder withIdentity(String name) {
        this.name = name;
        this.group = DEFAULT_GROUP;
        return this;
    }

    /**
     * Use a name and group to dentify the Stat4youJob.
     * <p>
     * If none of the 'withIdentity' methods are set on the JobBuilder, then a random, unique JobKey will be generated.
     * </p>
     * 
     * @param name the name element for the Job's JobKey
     * @param group the group element for the Job's JobKey
     * @return the updated Stat4youJobBuilder
     */
    public Stat4youJobBuilder withIdentity(String name, String group) {
        this.name = name;
        this.group = group;
        return this;
    }

    private static String createUniqueName(String group) {
        if (group == null) {
            group = DEFAULT_GROUP;
        }

        String n1 = UUID.randomUUID().toString();
        String n2 = UUID.nameUUIDFromBytes(group.getBytes()).toString();

        return String.format("%s-%s", n2.substring(24), n1);
    }

}
