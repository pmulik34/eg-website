import React, { useState, useEffect } from "react";
import {
  IconByName,
  AdminLayout as Layout,
  facilitatorRegistryService,
  testRegistryService,
  ImageView,
  AdminTypo,
  tableCustomStyles,
  GetEnumValue,
  enumRegistryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, Modal, VStack } from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import DataTable from "react-data-table-component";
import Clipboard from "component/Clipboard";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";

export default function Certification({ footerLinks }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState();
  const [enums, setEnums] = useState();
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState();
  const [loading, setLoading] = useState(false);
  const [downloadCertificate, setDownloadCertificate] = useState();

  const reportTemplateRef = React.useRef(null);

  const handleGeneratePdf = React.useCallback(async () => {
    const input = reportTemplateRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l");
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("download.pdf");
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const enumApiData = await enumRegistryService.listOfEnum();
      setEnums(enumApiData?.data);
    };
    fetchData();
  }, []);

  const certificateDownload = React.useCallback(async (data) => {
    const result = await testRegistryService.postCertificates(data);
    setDownloadCertificate(result?.data?.[0]?.certificate_html);
  }, []);

  useEffect(() => {
    const profileDetails = async () => {
      setLoading(true);
      const result = await facilitatorRegistryService.getOne({ id });
      setData(result);
      setLoading(false);
    };
    profileDetails();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await testRegistryService.getCertificate({ id });
      setCertificateData(result?.data);
    };
    fetchData();
  }, [id]);

  const columns = (t, certificateDownload) => [
    {
      name: t("EVENT_ID"),
      selector: (row) => row?.events?.[0]?.id,
    },
    {
      name: t("EVENT_TYPE"),
      selector: (row) => (
        <GetEnumValue
          t={t}
          enumType="FACILITATOR_EVENT_TYPE"
          enumOptionValue={row?.events?.[0]?.type}
          enumApiData={enums}
        />
      ),
      attr: "name",
      wrap: true,
    },
    {
      name: t("EVENT_SCHEDULED"),
      selector: (row) => (
        <GetEnumValue
          t={t}
          enumType="EVENT_BATCH_NAME"
          enumOptionValue={row?.events?.[0]?.name}
          enumApiData={enums}
        />
      ),
      attr: "name",
      wrap: true,
    },
    {
      name: t("SCORE"),
      selector: (row) => {
        const score = row?.score;
        const roundedScore = typeof score === "number" ? score.toFixed(2) : "-";
        return roundedScore;
      },
      attr: "name",
      wrap: true,
    },

    {
      name: t("STATUS"),
      selector: (row) =>
        row.certificate_status === true ? (
          <AdminTypo.Secondarybutton
            my="3"
            onPress={() => certificateDownload(row)}
          >
            {t("DOWNLOAD")}
          </AdminTypo.Secondarybutton>
        ) : row.certificate_status === false ? (
          <AdminTypo.H6 color="red.500">{t("FAILED")}</AdminTypo.H6>
        ) : (
          <AdminTypo.H6>{t("PENDING")}</AdminTypo.H6>
        ),
    },
  ];

  const columnsMemoized = React.useMemo(
    () => columns(t, certificateDownload),
    [t, certificateDownload],
  );

  return (
    <Layout _sidebar={footerLinks}>
      <VStack flex={1} space={"4"} p="3">
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="UserLineIcon" size="md" />
          <AdminTypo.H1 color="Activatedcolor.400">
            {t("ALL_PRERAK")}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(-1)}
          />
          <AdminTypo.H1
            color="textGreyColor.800"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {data?.first_name} {data?.last_name}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(-1)}
          />
          <Clipboard text={data?.id}>
            <Chip textAlign="center" lineHeight="15px" label={data?.id} />
          </Clipboard>
        </HStack>
        <HStack justifyContent={"space-between"} flexWrap="wrap">
          <VStack space="2" flexWrap="wrap">
            <ChipStatus status={data?.status} />
            <HStack
              bg="badgeColor.400"
              rounded={"md"}
              alignItems="center"
              p="2"
            >
              <IconByName
                _icon={{ size: "18px" }}
                name="CellphoneLineIcon"
                color="textGreyColor.300"
              />
              <AdminTypo.H6 color="textGreyColor.600" bold>
                {data?.mobile}
              </AdminTypo.H6>
            </HStack>
            <HStack
              bg="badgeColor.400"
              rounded={"md"}
              p="2"
              alignItems="center"
              space="2"
            >
              <IconByName
                isDisabled
                _icon={{ size: "20px" }}
                name="MapPinLineIcon"
                color="textGreyColor.300"
              />
              <AdminTypo.H6 color="textGreyColor.600" bold>
                {[
                  data?.state,
                  data?.district,
                  data?.block,
                  data?.village,
                  data?.grampanchayat,
                ]
                  .filter((e) => e)
                  .join(",")}
              </AdminTypo.H6>
            </HStack>
          </VStack>
          <HStack flex="0.5" justifyContent="center">
            {data?.profile_photo_1?.name ? (
              <ImageView
                source={{
                  uri: data?.profile_photo_1?.name,
                }}
                alt="profile photo"
                width={"120px"}
                height={"120px"}
              />
            ) : (
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="textGreyColor.300"
                _icon={{ size: "190px" }}
              />
            )}
          </HStack>
        </HStack>

        <VStack space={"5"}>
          <HStack justifyContent={"space-between"}>
            <AdminTypo.H4 bold color="textGreyColor.800">
              {t("CERTIFICATION")}
            </AdminTypo.H4>
            <HStack></HStack>
          </HStack>

          <DataTable
            bg="light.100"
            customStyles={tableCustomStyles}
            columns={columnsMemoized}
            data={certificateData}
            selectableRows
            persistTableHead
            progressPending={loading}
            pagination
            paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
            paginationServer
            onChangeRowsPerPage={(e) => {
              setFilter({ ...filter, limit: e });
            }}
            onChangePage={(e) => {
              setFilter({ ...filter, page: e });
            }}
          />
        </VStack>
      </VStack>
      <Modal isOpen={downloadCertificate} size="full" margin={"auto"}>
        <Modal.Content>
          <Modal.Header>
            <HStack justifyContent={"space-between"} pr="10">
              <AdminTypo.H1>{t("CERTIFICATION")}</AdminTypo.H1>
              <AdminTypo.Secondarybutton onPress={() => handleGeneratePdf()}>
                {t("DOWNLOAD")}
              </AdminTypo.Secondarybutton>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setDownloadCertificate()}
              />
            </HStack>
          </Modal.Header>
          <div className="certificae-parent">
            <Modal.Body>
              <div ref={reportTemplateRef} className="certificae-height">
                <div
                  dangerouslySetInnerHTML={{ __html: downloadCertificate }}
                />
              </div>
            </Modal.Body>
          </div>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
Certification.propTypes = {
  footerLinks: PropTypes.any,
};
