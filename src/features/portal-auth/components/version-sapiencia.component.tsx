
interface IVersionComponente {
    version: string;
  }

const VersionSapiencia = ({
    version,
  }: IVersionComponente): React.JSX.Element => {
    return (
      <div className="content-version">
        <p className="text-black bug weight-900 not-margin-padding">
          Powered by:
        </p>
        <p className="text-primary not-margin-padding bug ">Sapiencia</p>
        <p className="text-main weight-500 not-margin-padding bug ">v{version}</p>
      </div>
    );
  };

export default VersionSapiencia;