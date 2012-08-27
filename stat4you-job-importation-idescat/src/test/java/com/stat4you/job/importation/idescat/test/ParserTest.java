package com.stat4you.job.importation.idescat.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.InputStream;

import javax.xml.bind.JAXB;
import javax.xml.datatype.DatatypeFactory;

import org.junit.Test;

import com.stat4you.job.importation.idescat.domain.EmexFitxes;
import com.stat4you.job.importation.idescat.domain.EmexGroup;
import com.stat4you.job.importation.idescat.domain.EmexRow;
import com.stat4you.job.importation.idescat.domain.EmexTable;

public class ParserTest {

    @Test
    public void readDadesLangEsId_09() throws Exception {
        InputStream file = ParserTest.class.getResourceAsStream("/emex/dades/dades-lang_es-id_09.xml");

        EmexFitxes emexFitxes = JAXB.unmarshal(file, EmexFitxes.class);

        assertEquals("es", emexFitxes.getLang());
        assertEquals("dades", emexFitxes.getOperation());

        assertEquals(2, emexFitxes.getColumns().getColumn().size());
        assertEquals("09", emexFitxes.getColumns().getColumn().get(0).getId());
        assertEquals("com", emexFitxes.getColumns().getColumn().get(0).getScheme());
        assertEquals("Baix Ebre", emexFitxes.getColumns().getColumn().get(0).getContent());
        assertEquals("09", emexFitxes.getColumns().getColumn().get(1).getId());
        assertEquals("ca", emexFitxes.getColumns().getColumn().get(1).getScheme());
        assertEquals("Catalunya", emexFitxes.getColumns().getColumn().get(1).getContent());
        assertNotNull(emexFitxes.getGroups());
        assertEquals(9, emexFitxes.getGroups().getGroup().size());

        EmexGroup emexGroup = emexFitxes.getGroups().getGroup().get(0);
        assertEquals("g173", emexGroup.getId());
        assertEquals("Territorio", emexGroup.getName());
        assertNotNull(emexGroup.getTables());
        assertEquals(1, emexGroup.getTables().getTable().size());

        EmexTable emexTable = emexGroup.getTables().getTable().get(0);
        assertEquals("t176", emexTable.getId());
        assertEquals("Indicadores geográficos", emexTable.getName());
        assertEquals("2011", emexTable.getTimeReference());
        assertEquals("Idescat, a partir de los datos del Institut Cartogràfic de Catalunya.", emexTable.getSource());
        assertEquals("http://www.idescat.cat/territ/BasicTerr?TC=6&V0=2&V1=13&MN=1&V3=215&PARENT=91&CTX=B&lang=es", emexTable.getLink());
        assertNotNull(emexTable.getRows());
        assertEquals(6, emexTable.getRows().getRow().size());

        EmexRow emexRow = emexTable.getRows().getRow().get(0);
        assertEquals("f271", emexRow.getId());
        assertEquals("Superficie", emexRow.getName());
        assertEquals("Superficie", emexRow.getAlternativeName());
        assertEquals("1002.7,32108.0", emexRow.getValues());
        assertEquals("Km2", emexRow.getUnits());
        assertEquals(DatatypeFactory.newInstance().newXMLGregorianCalendar("2011-12-19T11:00:00+00:00"), emexRow.getUpdated());
    }

}
