package com.stat4you.crawler.droids.enums;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public enum IneSubjectEnum implements Serializable {

    SUBJECT_01("01", "01", "Agricultura, ganadería, selvicultura, caza, pesca y piscicultura de agua dulce"),
    SUBJECT_011("01", "011", "Estructuras agrarias, registros y medios de producción"),
    SUBJECT_012("01", "012", "Producción agrícola"),
    SUBJECT_013("01", "013", "Producción ganadera"),
    SUBJECT_015("01", "015", "Selvicultura, caza, pesca y piscicultura de agua dulce"),
    SUBJECT_017("01", "017", "Comercio y precios agrarios (productos, medios de producción, índices)"),
    SUBJECT_019("01", "019", "Análisis, síntesis y recopilaciones agrarias"),

    SUBJECT_02("02", "02", "Pesca marítima"),
    SUBJECT_021("02", "021", "Flota y otros medios de producción"),
    SUBJECT_022("02", "022", "Actividad de las empresas pesqueras"),
    SUBJECT_023("02", "023", "Producción pesquera"),
    SUBJECT_027("02", "027", "Comercio y precios pesqueros"),
    SUBJECT_029("02", "029", "Análisis, síntesis y recopilaciones pesqueras)"),

    SUBJECT_04("04", "04", "Extracción de productos energéticos y energía en general"),
    SUBJECT_042("04", "042", "Producción energética"),
    SUBJECT_047("04", "047", "Distribución y consumo de productos energéticos"),
    SUBJECT_049("04", "049", "Precios, análisis, síntesis y recopilaciones energéticas"),

    SUBJECT_05("05", "05", "Minería e industria, captación y distribución de agua, recuperación"),
    SUBJECT_051("05", "051", "Empresas y establecimientos industriales"),
    SUBJECT_052("05", "052", "Extracción de minerales"),
    SUBJECT_053("05", "053", "Captación y distribución de agua"),
    SUBJECT_054("05", "054", "Industria agroalimentaria"),
    SUBJECT_055("05", "055", "Industria manufacturera y recuperación"),
    SUBJECT_059("05", "059", "Precios, análisis, síntesis y recopilaciones industriales"),

    SUBJECT_07("07", "07", "Construcción y vivienda"),
    SUBJECT_072("07", "072", "Construcción en general (edificación y obra pública)"),
    SUBJECT_074("07", "074", "Parque de edificios y viviendas y su utilización"),
    SUBJECT_079("07", "079", "Precios, análisis, síntesis y recopilaciones de la construcción y vivienda"),

    SUBJECT_09("09", "09", "Comercio interior y exterior, reparaciones"),
    SUBJECT_092("09", "092", "Comercio interior y reparaciones"),
    SUBJECT_095("09", "095", "Comercio exterior de bienes"),
    SUBJECT_096("09", "096", "Comercio exterior de servicios"),
    SUBJECT_099("09", "099", "Precios, análisis, síntesis y recopilaciones del comercio"),

    SUBJECT_10("10", "10", "Transporte y actividades conexas, comunicaciones"),
    SUBJECT_101("10", "101", "Empresas y actividad del transporte en general"),
    SUBJECT_102("10", "102", "Transporte terrestre"),
    SUBJECT_103("10", "103", "Transporte marítimo"),
    SUBJECT_104("10", "104", "Transporte aéreo"),
    SUBJECT_105("10", "105", "Actividades anexas a los transportes"),
    SUBJECT_106("10", "106", "Comunicaciones"),
    SUBJECT_109("10", "109", "Análisis, síntesis y recopilaciones de los transportes"),

    SUBJECT_11("11", "11", "Hostelería y turismo"),
    SUBJECT_112("11", "112", "Oferta turística"),
    SUBJECT_117("11", "117", "Demanda turística"),
    SUBJECT_119("11", "119", "Precios, análisis, síntesis y recopilaciones turísticos"),

    SUBJECT_12("12", "12", "Cultura, deporte y ocio"),
    SUBJECT_121("12", "121", "Infraestructura, equipamiento, entes y prácticas culturales en general"),
    SUBJECT_122("12", "122", "Libros y bibliotecas"),
    SUBJECT_123("12", "123", "Artes plásticas y patrimonio histórico-artístico"),
    SUBJECT_124("12", "124", "Artes escénicas y de la música"),
    SUBJECT_125("12", "125", "Cinematografía y artes audiovisuales"),
    SUBJECT_126("12", "126", "Juegos de azar y apuestas"),
    SUBJECT_128("12", "128", "Deportes"),
    SUBJECT_129("12", "129", "Análisis, síntesis y recopilaciones de cultura y ocio"),

    SUBJECT_13("13", "13", "Educación"),
    SUBJECT_131("13", "131", "Infraestructura, equipamiento y entes para educación"),
    SUBJECT_132("13", "132", "Personal y aspectos económicos de la educación"),
    SUBJECT_133("13", "133", "Actividad del sistema educativo"),
    SUBJECT_134("13", "134", "Resultados y evaluación del sistema educativo"),
    SUBJECT_137("13", "137", "Formación profesional y relación educación empleo"),
    SUBJECT_139("13", "139", "Análisis, síntesis y recopilaciones en educación"),

    SUBJECT_14("14", "14", "Investigación y desarrollo tecnológico"),
    SUBJECT_141("14", "141", "Infraestructura, equipamiento y entes para I+D"),
    SUBJECT_142("14", "142", "Recursos económicos, personal y actividades en I+D"),
    SUBJECT_144("14", "144", "Producción y transferencia en I+D"),
    SUBJECT_149("14", "149", "Análisis, síntesis y recopilaciones en I+D"),

    SUBJECT_15("15", "15", "Salud"),
    SUBJECT_151("15", "151", "Infraestructura, entes y equipamiento sanitario"),
    SUBJECT_152("15", "152", "Personal, recursos económicos y actividades del sistema sanitario"),
    SUBJECT_153("15", "153", "Vigilancia epidemiológica"),
    SUBJECT_156("15", "156", "Estado de salud y factores condicionantes"),
    SUBJECT_158("15", "158", "Medicamentos y otros productos sanitarios"),
    SUBJECT_159("15", "159", "Análisis, síntesis y recopilaciones de salud"),

    SUBJECT_16("16", "16", "Protección social y servicios sociales"),
    SUBJECT_161("16", "161", "Infraestructura, equipamiento y entes de servicios sociales"),
    SUBJECT_162("16", "162", "Personal, recursos económicos y actividades en servicios sociales"),
    SUBJECT_163("16", "163", "Seguridad social contributiva"),
    SUBJECT_164("16", "164", "Clases pasivas"),
    SUBJECT_165("16", "165", "Otras prestaciones económicas"),
    SUBJECT_169("16", "169", "Análisis, síntesis y recopilaciones de protección y asistencia social"),

    SUBJECT_17("17", "17", "Seguridad"),
    SUBJECT_172("17", "172", "Seguridad ciudadana"),
    SUBJECT_173("17", "173", "Seguridad vial y accidentes de tráfico"),
    SUBJECT_174("17", "174", "Protección civil"),

    SUBJECT_18("18", "18", "Justicia"),
    SUBJECT_182("18", "182", "Actividad judicial"),
    SUBJECT_184("18", "184", "Actividad penitenciaria"),
    SUBJECT_185("18", "185", "Actividad registral y notarial"),
    SUBJECT_189("18", "189", "Análisis, síntesis y recopilaciones de justicia"),

    SUBJECT_20("20", "20", "Demografía y población"),
    SUBJECT_201("20", "201", "Estructura y situación de la población"),
    SUBJECT_204("20", "204", "Movimientos de la población"),
    SUBJECT_209("20", "209", "Proyecciones, análisis demográficos y recopilaciones"),

    SUBJECT_22("22", "22", "Trabajo, ingresos y costes salariales"),
    SUBJECT_222("22", "222", "Mercado de trabajo"),
    SUBJECT_224("22", "224", "Relaciones laborales y otros aspectos del trabajo"),
    SUBJECT_226("22", "226", "Ingresos y costes salariales"),
    SUBJECT_229("22", "229", "Análisis, síntesis y recopilaciones en el ámbito laboral"),

    SUBJECT_25("25", "25", "Nivel, calidad y condiciones de vida"),
    SUBJECT_251("25", "251", "Infraestructura y equipamiento social"),
    SUBJECT_252("25", "252", "Consumo y distribución de la renta"),
    SUBJECT_253("25", "253", "Situación social de grupos específicos"),
    SUBJECT_254("25", "254", "Condiciones y calidad de vida"),
    SUBJECT_255("25", "255", "Opinión pública"),
    SUBJECT_259("25", "259", "Análisis, síntesis y recopilaciones en el ámbito de la calidad y condiciones de vida"),
    
    SUBJECT_26("26", "26", "Medio ambiente y desarrollo sostenible"),
    SUBJECT_261("26", "261", "Recursos naturales y su utilización y rehabilitación"),
    SUBJECT_262("26", "262", "Personal, recursos económicos y actividades en medio ambiente"),
    SUBJECT_263("26", "263", "Clima y meteorología"),
    SUBJECT_264("26", "264", "Calidad, vigilancia, control y prevención del medio ambiente"),
    SUBJECT_266("26", "266", "Generación, gestión y tratamiento de residuos"),
    SUBJECT_267("26", "267", "Desarrollo sostenible"),
    SUBJECT_269("26", "269", "Precios, análisis, síntesis y recopilaciones sobre el medio ambiente y el desarrollo sostenible"),
    
    SUBJECT_30("30", "30", "Financieras, monetarias y seguros"),
    SUBJECT_302("30", "302", "Entidades de crédito y otras instituciones financieras"),
    SUBJECT_303("30", "303", "Seguros y fondos de pensiones"),
    SUBJECT_304("30", "304", "Finanzas públicas"),
    SUBJECT_305("30", "305", "Sector exterior"),
    SUBJECT_306("30", "306", "Mercado interbancario"),
    SUBJECT_307("30", "307", "Mercados primario y secundario de valores"),
    SUBJECT_308("30", "308", "Estadísticas financieras varias"),
    SUBJECT_309("30", "309", "Síntesis y recopilaciones financieras y monetarias"),
    
    SUBJECT_32("32", "32", "Administraciones públicas, actividad política y asociaciones"),
    SUBJECT_321("32", "321", "Entes, medios y actividad de las administraciones públicas"),
    SUBJECT_322("32", "322", "Personal de las administraciones públicas y sus retribuciones"),
    SUBJECT_323("32", "323", "Presupuestarias y fiscales"),
    SUBJECT_325("32", "325", "Actividad política"),
    SUBJECT_327("32", "327", "Asociaciones"),
     
    SUBJECT_35("35", "35", "Cuentas económicas"),
    SUBJECT_352("35", "302", "Contabilidad Nacional"),
    SUBJECT_353("35", "303", "Contabilidad regional y local"),
    SUBJECT_354("35", "304", "Cuentas de sectores y subsectores institucionales"),
    SUBJECT_355("35", "305", "Cuentas financieras y balanza de pagos"),
    SUBJECT_356("35", "306", "Contabilidad patrimonial"),
    
    SUBJECT_37("37", "37", "Estadísticas de empresas y unidades de producción no referidas a sectores particulares"),
    SUBJECT_371("37", "302", "Registros y directorios de unidades de producción"),
    SUBJECT_373("37", "303", "Estadísticas generales de unidades de producción"),
    SUBJECT_379("37", "304", "Precios, análisis, síntesis y recopilaciones generales de unidades de producción"),
    
    SUBJECT_38("38", "38", "Estadísticas no desglosables por sector o tema"),
    SUBJECT_382("38", "382", "Estadísticas y recopilaciones generales"),
    SUBJECT_384("38", "384", "Bancos de datos generales"),
    
    // The following not is category in STAT4YOU, and the aren't PXs.
//    SUBJECT_40("40", StringUtils.EMPTY, "Normalización y metodología general"),
//    SUBJECT_402("40", "402", "Elaboración y sistematización del uso de marcos conceptuales"),
//    SUBJECT_403("40", "403", "Métodos y procedimientos estadísticos de amplio uso"),
//    SUBJECT_404("40", "404", "Catalogación y análisis de fuentes administrativas de uso estadístico efectivo o potencial"),
//    SUBJECT_405("40", "405", "Elaboración de normas y manuales de aplicación"),
//    SUBJECT_406("40", "406", "Organización y difusión de la metainformación"),
    
    // The following subjects dont appears in the Incentario de Operaciones Estadísticas (INE). See
    // http://www.ine.es/ss/Satellite?L=es_ES&c=Page&cid=1254735495979&p=1254735495979&pagename=IOEhist%2FIOEhistLayout&rendermode=previewnoinsite
    SUBJECT_19("19", "19", "Otros Servicios Empresariales, Personales y Comunitarios"),
    SUBJECT_41("41", "41", "Comercio exterior"),
    SUBJECT_42("42", "42", "Internacional"),
    SUBJECT_43("43", "43", "Entorno físico"),
    SUBJECT_44("44", "44", "Procesos electorales"),
    SUBJECT_45("45", "45", "Información tributaria"),
    
    ;

    private static Map<String, IneSubjectEnum> subSubjectIdentifierMap = new HashMap<String, IneSubjectEnum>();
//    private static Map<String, IneSubjectEnum> subjectIdentifierMap = new HashMap<String, IneSubjectEnum>();

    static {
        for (IneSubjectEnum value : IneSubjectEnum.values()) {
            subSubjectIdentifierMap.put(value.getSubSubject(), value);
//            subjectIdentifierMap.put(value.getSubject(), value);
        }
    }

    private String                             subject;
    private String                             subSubject;
    private String                             value;

    /**
     */
    private IneSubjectEnum(String subject, String subSubject, String value) {
        this.subject = subject;
        this.subSubject = subSubject;
        this.value = value;
    }

    public static IneSubjectEnum fromSubSubject(String value) {
        IneSubjectEnum result = subSubjectIdentifierMap.get(value);
        if (result == null) {
            throw new IllegalArgumentException("No SUBJECT for subSubject: " + value);
        }
        return result;
    }
/*    
    public static IneSubjectEnum fromSubject(String value) {
        IneSubjectEnum result = subjectIdentifierMap.get(value);
        if (result == null) {
            throw new IllegalArgumentException("No SUBJECT for subSubject: " + value);
        }
        return result;
    }
*/
    public String getValue() {
        return value;
    }
  
    public String getSubject() {
        return subject;
    }
        
    public String getSubSubject() {
        return subSubject;
    }
        
    public String getName() {
        return name();
    }
}
