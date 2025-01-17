import ElectionDetails from "./electionDetails";

const ElectionDetailsPage = async ({ params }: { params: { id: string } }) => {
    const id = (await params).id;
    console.log(id);

    return (
        <ElectionDetails id={id} />
    )
}

export default ElectionDetailsPage;